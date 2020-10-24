import * as BTC from "bitcoinjs-lib";
import {AddressesList, Folder, FolderAddress, FolderType, FolderXPubBranch} from "./Types";
import * as b58 from "bs58check";

export const STARTING_DERIVATION_PATH = "0/0,1/0";
export const DERIVATION_BATCH_SIZE = 10;

export function generateAddresses(paths: string[], xpub: string): FolderAddress[] {
    const network = BTC.networks.bitcoin;
    const convertedPubKey = ['y', 'z'].includes(xpub[0]) ? convertPubToXPub(xpub) : xpub;
    const address = BTC.bip32.fromBase58(convertedPubKey, network);
    return paths.map(path => {
        const result = {
            name: path,
            derivationPath: path,
            address: ""
        };
        const derived = address.derivePath(path);
        switch (xpub[0]) {
            case 'x':
                result.address = BTC.payments.p2pkh({pubkey: derived.publicKey, network}).address;
                break;
            case 'y':
                result.address = BTC.payments.p2sh({
                    redeem: BTC.payments.p2wpkh({pubkey: derived.publicKey, network}),
                    network
                }).address;
                break;
            case 'z':
                result.address = BTC.payments.p2wpkh({pubkey: derived.publicKey, network}).address;
                break;
        }
        return result;
    });
}

export function getNextNPaths(startingPath: string, count: number): string[] {
    const parts = startingPath.split("/");
    const lastPartNumber = parseInt(parts.pop());
    const paths: string[] = [];
    for(let i = 0; i<count; i++){
        paths.push([...parts, lastPartNumber+i].join("/"))
    }
    return paths;
}

export function initializeAddressesDerivation(folder: Folder, branch: FolderXPubBranch) {
    if(folder.type === FolderType.SIMPLE) return;

    const countToAdd = Math.max(DERIVATION_BATCH_SIZE-folder.addresses.length, 0);

    const pathsToAdd = getNextNPaths(branch.nextPath, countToAdd);

    return generateAddresses(pathsToAdd, folder.address);
}

export function generateNextNAddresses(folder: Folder, folderXPubBranch: FolderXPubBranch, count: number) {
    if(folder.type === FolderType.SIMPLE) return;
    const pathsToAdd = getNextNPaths(folderXPubBranch.nextPath, count);

    return generateAddresses(pathsToAdd, folder.address);
}

/*
 * We get the last derived address in the folder and check if it has some balance.
 * If so, we scan the next 10 addresses.
 */
export function shouldDeriveMoreAddresses(folder: Folder, folderXPubBranch: FolderXPubBranch, addresses: AddressesList) {
    if(folder.type === FolderType.SIMPLE) return false;

    const lastNDerived = folderXPubBranch.addresses.slice(-10)
    if(lastNDerived.length < 10) return true;

    return lastNDerived.some((folderAddress) => {
        return addresses[folderAddress.address].transactionCount > 0;
    });
}


const prefixes = new Map(
    [
        ['xpub', '0488b21e'],
        ['ypub', '049d7cb2'],
        ['Ypub', '0295b43f'],
        ['zpub', '04b24746'],
        ['Zpub', '02aa7ed3'],
        ['tpub', '043587cf'],
        ['upub', '044a5262'],
        ['Upub', '024289ef'],
        ['vpub', '045f1cf6'],
        ['Vpub', '02575483'],
    ]
);

export function convertPubToXPub(pubKey: string): string{
    try {
        var data = b58.decode(pubKey);
        data = data.slice(4);
        data = Buffer.concat([Buffer.from(prefixes.get("xpub"),'hex'), data]);
        return b58.encode(data);
    } catch (err) {
        console.error(err)
        throw err;
    }
}
