import {AddressStatusType} from "../../components/AddressStatus";
import {AddressesList, AddressValue, Explorer} from "../Types";
import * as Actions from "../../store/actions";
import store from "../../store/store";

export default class Mempool implements Explorer {

    async fetch(address: string, addressContent: AddressValue): Promise<AddressValue> {
        let dispatch = store.dispatch;
        try {
            let request = await fetch('https://mempool.space/electrs/address/' + address);
            let parsed = await request.json();
            let result = parsed.chain_stats.funded_txo_sum - parsed.chain_stats.spent_txo_sum;

            return {balance: result, status: AddressStatusType.OK};
        } catch (e) {
            return {balance: addressContent.balance, status: AddressStatusType.ERROR};
        }
    }

    async fetchAndUpdate(addresses: AddressesList) {
        let dispatch = store.dispatch;
        let addressesList = Object.keys(addresses);
        let queries = Object.entries(addresses).map(([address, addressContent]) => {

            return this.fetch(address, addressContent).then(result => {
                dispatch(Actions.updateSingleAddressBalance(address, result));
                return result;
            })

        });

        let results = await Promise.all(queries);

    }

}
