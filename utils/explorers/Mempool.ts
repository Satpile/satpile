import {AddressStatusType} from "../../components/AddressStatus";
import {AddressesBalanceDifference, AddressesList, AddressValue, Explorer} from "../Types";
import * as Actions from "../../store/actions";
import store from "../../store/store";
import {generateUid} from "../Helper";
import {requestsDebouncer} from "../RequestDebouncer";

const wait = async (ms: number) => new Promise((resolve => setTimeout(resolve, ms)));

export default class Mempool implements Explorer {

     constructor(public url: string) {}

    async fetch(address: string, addressContent: AddressValue): Promise<AddressValue> {
        try {
            await wait(Math.floor(Math.random()*1000)); // Reduce number of concurrent requests
            let request = await fetch(`${this.url}/api/address/` + address);
            const parsed = await request.json();

            let result = parsed.chain_stats.funded_txo_sum - parsed.chain_stats.spent_txo_sum;
            const txCount = parsed.chain_stats.tx_count;

            return {
                balance: result,
                status: AddressStatusType.OK,
                transactionCount: txCount
            };
        } catch (e) {
            return {
                balance: addressContent.balance,
                status: AddressStatusType.ERROR,
                transactionCount: addressContent.transactionCount
            };
        }
    }

    async fetchAndUpdate(addresses: AddressesList): Promise<AddressesBalanceDifference[]> {
        const dispatch = store.dispatch;
        const diff: AddressesBalanceDifference[] = [];

        const queries = Object.entries(addresses).map(([address, addressContent]) => {
        //We map each address to a promise

            const requestUniqId = generateUid();
            requestsDebouncer[address] = requestUniqId;
            //we set this request as the most recent request for this address

            return this.fetch(address, addressContent).then(result => {
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
            })
        });

        await Promise.all(queries);

        return diff;

    }

}
