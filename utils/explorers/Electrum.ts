import ElectrumCli from './ElectrumClient';
import * as bitcoin from 'bitcoinjs-lib';
import {AddressesBalanceDifference, AddressesList, AddressValue, Explorer, ElectrumOptions} from '../Types';
import {Toast} from "../../components/Toast";
import {i18n} from "../../translations/i18n";
import store from "../../store/store";
import {generateUid} from "../Helper";
import {requestsDebouncer} from "../RequestDebouncer";
import {AddressStatusType} from "../../components/AddressStatus";
import * as Actions from "../../store/actions";


export class Electrum implements Explorer {
    constructor(public options: ElectrumOptions) {}

    /*private async connect() {
        try{
            await new Promise(async (resolve, reject) => {
                const cancel = setTimeout(() => {
                    this.connection.close();
                    this.connection.conn.end();
                    this.connection.conn.destroy();

                }, 5000);
                const connection = this.connection;
                this.connection.onError = function (e) {
                    reject(e);
                    //connection.close();
                };
                await this.connection.connect();
                //clearTimeout(cancel);
                resolve();
            });
        }catch(e){
            Toast.showToast({
                message: e.toString(),
                duration: 2000,
                type:  "top"
            });
        }

    }*/

    public async connect(){
        try{
            const client = new ElectrumCli(this.options.port, this.options.host, this.options.protocol);
            await client.connect();
            await client.server_ping();
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
        const diff: AddressesBalanceDifference[] = [];
        const dispatch = store.dispatch;

        let client;

        try{
           client = await this.connect();
        }catch(e){
            return [];
        }

        const queries = Object.entries(addresses).map(([address, addressContent]) => {
            const requestUniqId = generateUid();
            requestsDebouncer[address] = requestUniqId;
            return this.fetch(client, address, addressContent).then(result => {
                if(requestUniqId !== requestsDebouncer[address]){
                    // In the meantime, if the requestId coresponding to this address has changed,
                    // it means this request is obsolete. We ignore it.
                    return;
                }
                delete requestsDebouncer[address]; //clean debouncer

                if (addressContent.balance !== result.balance || addressContent.transactionCount !== result.transactionCount) { //We store all the differences
                    diff.push({
                        address: address,
                        before: addressContent,
                        after: result
                    })
                }

                if (addressContent.balance !== result.balance || addressContent.status !== result.status || addressContent.transactionCount !== result.transactionCount) {
                    //We only update the state if the result has changed
                    setTimeout(() => dispatch(Actions.updateSingleAddressBalance(address, result)), 0);
                }

                return result;
            });
        });

        try{
            await Promise.all(queries);
        }catch (e){
            throw e;
        }finally {
            client.close();
        }
        return diff;
    }

    addressToHashScript(address: string) {
        const script = bitcoin.address.toOutputScript(address)
        const hash = bitcoin.crypto.sha256(script)
        const reversedHash = new Buffer(hash.reverse());
        return reversedHash.toString('hex');
    }

    async getBalance (ecl, addressHash) {
        return await ecl.request("blockchain.scripthash.get_balance", [addressHash]);
    }

    async getTransactions (ecl, addressHash) {
        const result = await ecl.request("blockchain.scripthash.get_history", [addressHash]);
        return result.filter(tx => tx.height > 0);
    }

    async fetch (ecl: typeof ElectrumCli, address: string, addressContent: AddressValue): Promise<AddressValue>{
        const hash = this.addressToHashScript(address);
        try{
            const transactionCount = (await this.getTransactions(ecl, hash)).length;
            const balance = ( await this.getBalance(ecl, hash)).confirmed;

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
