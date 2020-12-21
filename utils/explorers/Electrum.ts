import ElectrumCli from './ElectrumClient';
import * as bitcoin from 'bitcoinjs-lib';
import {AddressesBalanceDifference, AddressesList, AddressValue, Explorer, ElectrumOptions} from '../Types';
import {Toast} from "../../components/Toast";
import {i18n} from "../../translations/i18n";
import {AddressStatusType} from "../../components/AddressStatus";
import AbstractExplorer from "./AbstractExplorer";

export class Electrum extends AbstractExplorer implements Explorer {
    private client : typeof ElectrumCli;
    constructor(public options: ElectrumOptions) {
        super();
    }

    public async connect(){
        try{
            const client = new ElectrumCli(this.options.port, this.options.host, this.options.protocol);
            await client.connect();
            await client.server_ping();
            this.client = client;
            return client;
        }catch(e) {
            Toast.showToast({
                message: i18n.t("connection_error", {server: `${this.options.protocol}://${this.options.host}:${this.options.port}`}),
                duration: 2000,
                type:  "top"
            });
            throw e;
        }
    }

    async fetchAndUpdate(addresses: AddressesList): Promise<AddressesBalanceDifference[]> {
        let diff: AddressesBalanceDifference[] = [];

        try{
           await this.connect();
        }catch(e){
            return [];
        }

        try{
            diff = await this.runQueries(addresses);
        }catch (e){
            throw e;
        }finally {
            this.client.close();
        }
        return diff;
    }

    addressToHashScript(address: string) {
        const script = bitcoin.address.toOutputScript(address)
        const hash = bitcoin.crypto.sha256(script)
        const reversedHash = new Buffer(hash.reverse());
        return reversedHash.toString('hex');
    }

    async getBalance (addressHash) {
        return await this.client.request("blockchain.scripthash.get_balance", [addressHash]);
    }

    async getTransactions (addressHash) {
        const result = await this.client.request("blockchain.scripthash.get_history", [addressHash]);
        return result.filter(tx => tx.height > 0);
    }

    async fetch (address: string, addressContent: AddressValue): Promise<AddressValue>{
        const hash = this.addressToHashScript(address);
        try{
            const transactionCount = (await this.getTransactions(hash)).length;
            const balance = ( await this.getBalance(hash)).confirmed;

            return {
                transactionCount,
                balance,
                status: AddressStatusType.OK
            }
        }catch(e){
            return {
                balance: addressContent.balance,
                status: AddressStatusType.ERROR,
                transactionCount: addressContent.transactionCount
            };
        }

    }

}
