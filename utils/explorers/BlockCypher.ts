import {AddressStatusType} from "../../components/AddressStatus";
import {AddressValue, Explorer} from "../Types";
import AbstractExplorer from "./AbstractExplorer";

const wait = async (ms: number) => new Promise((resolve => setTimeout(resolve, ms)));

export default class BlockCypher extends AbstractExplorer implements Explorer {

    async fetch(address: string, addressContent: AddressValue): Promise<AddressValue> {
        try {
            await wait(Math.floor(Math.random()*1000)); // Reduce number of concurrent requests
            let request = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/` + address);
            const parsed = await request.json();
            let result = parsed.balance;
            const txCount = parsed.n_tx;

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
