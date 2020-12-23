import {AddressStatusType} from "../../components/AddressStatus";
import {AddressValue, Explorer} from "../Types";
import AbstractExplorer from "./AbstractExplorer";
import Tor from "react-native-tor";


const tor = Tor();


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

    private async fetchTor(url: string) {
        await tor.startIfNotStarted();
        return tor.get(url);
    }

    async fetch(address: string, addressContent: AddressValue): Promise<AddressValue> {
        try {
            let request;
            let parsed;
            if(this.url.endsWith(".onion")){
                request = await this.fetchTor(`${this.url}/api/address/` + address);
                parsed = request.json;
                if(request.respCode !== 200){
                    throw new Error(request.status+"");
                }
            }else{
                request = await fetch(`${this.url}/api/address/` + address);
                parsed = await request.json();
                if(request.status !== 200){
                    throw new Error(request.status+"");
                }
            }

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
