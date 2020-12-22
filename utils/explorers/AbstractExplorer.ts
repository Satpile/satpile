import {AddressesBalanceDifference, AddressesList, AddressValue, Explorer} from "../Types";
import store from "../../store/store";
import {generateUid} from "../Helper";
import {requestsDebouncer} from "../RequestDebouncer";
import * as Actions from "../../store/actions";

const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default abstract class AbstractExplorer implements Explorer {

    abstract fetch(address: string, addressContent: AddressValue): Promise<AddressValue>;

    public isCoolDownImplemented(): boolean{
        return false;
    }

    protected getBaseCountdown() {
        return 0;
    }

    protected async runQueries(addresses: AddressesList): Promise<AddressesBalanceDifference[]> {
        const dispatch = store.dispatch;
        const diff: AddressesBalanceDifference[] = [];

        await Promise.all(Object.entries(addresses).map(async ([address, addressContent], i) => {
            //We map each address to a promise

            const requestUniqId = generateUid();
            requestsDebouncer[address] = requestUniqId;
            //we set this request as the most recent request for this address
            if(this.isCoolDownImplemented()){
                await wait(this.getBaseCountdown()*i);
            }

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
        }));

        return diff;
    }

    async fetchAndUpdate(addresses: AddressesList): Promise<AddressesBalanceDifference[]> {
        return this.runQueries(addresses)
    }
}
