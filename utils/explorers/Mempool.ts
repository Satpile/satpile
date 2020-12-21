import {AddressStatusType} from "../../components/AddressStatus";
import {AddressValue, Explorer} from "../Types";
import AbstractExplorer from "./AbstractExplorer";

const wait = async (ms: number) => new Promise((resolve => setTimeout(resolve, ms)));

export default class Mempool extends AbstractExplorer implements Explorer {

    constructor(public url: string) {
        super();
    }

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
}
