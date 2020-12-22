import {AddressStatusType} from "../../components/AddressStatus";
import {AddressValue, Explorer} from "../Types";
import AbstractExplorer from "./AbstractExplorer";

export default class Mempool extends AbstractExplorer implements Explorer {

    constructor(public url: string, public cooldown: number = 0) {
        super();
    }

    public isCoolDownImplemented(): boolean{
        return true;
    }

    protected getBaseCountdown(): number {
        return this.cooldown;
    }

    async fetch(address: string, addressContent: AddressValue): Promise<AddressValue> {
        try {
            let request = await fetch(`${this.url}/api/address/` + address);
            if(request.status !== 200){
                throw new Error(request.status+"");
            }
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
