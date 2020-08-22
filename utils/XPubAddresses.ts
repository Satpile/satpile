import * as BTC from "bitcoinjs-lib";
import {AddressesList, Folder, FolderAddress, FolderType} from "./Types";

export const STARTING_DERIVATION_PATH = "m/1/-1";
export const DERIVATION_BATCH_SIZE = 10;

export function generateAddresses(paths: string[], xpub: string): FolderAddress[] {
    return paths.map(path => {
        const bech = BTC.bip32.fromBase58(xpub);
        const derived = BTC.bip32.fromBase58(xpub).derivePath(path);
        return {
            name: path,
            address: BTC.payments.p2pkh({pubkey: derived.publicKey}).address,
            derivationPath: path
        };
    });
}

export function getNextNPaths(lastPath: string, count: number): string[] {
    const parts = lastPath.split("/");
    const lastPartNumber = parseInt(parts.pop());
    const paths: string[] = [];
    for(let i = 0; i<count; i++){
        paths.push([...parts, lastPartNumber+i+1].join("/"))
    }
    return paths;
}

export function initializeAddressesDerivation(folder: Folder) {
    if(folder.type === FolderType.SIMPLE) return;

    const countToAdd = Math.max(DERIVATION_BATCH_SIZE-folder.addresses.length, 0);

    const pathsToAdd = getNextNPaths(folder.xpubConfig?.lastPath || STARTING_DERIVATION_PATH, countToAdd);

    return generateAddresses(pathsToAdd, folder.address);
}

export function generateNextNAddresses(folder: Folder, count: number) {
    if(folder.type === FolderType.SIMPLE) return;

    const pathsToAdd = getNextNPaths(folder.xpubConfig?.lastPath || STARTING_DERIVATION_PATH, count);

    return generateAddresses(pathsToAdd, folder.address);
}

/*
 * We get the last derived address in the folder and check if it has some balance.
 * If so, we scan the next 10 addresses.
 */
export function shouldDeriveMoreAddresses(folder: Folder, addresses: AddressesList) {
    if(folder.type === FolderType.SIMPLE) return false;

    const lastDerived = folder.addresses.find(folderAddress => folderAddress.derivationPath === folder.xpubConfig.lastPath);
    if(!lastDerived){ return true; }

    return addresses[lastDerived.address].balance > 0;
}
