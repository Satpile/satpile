import {AddressStatusType} from "../../components/AddressStatus";
import {AddressesList, AddressValue} from "../Types";
import AbstractBatchableExplorer from "./AbstractBatchableExplorer";

const wait = async (ms: number) => new Promise((resolve => setTimeout(resolve, ms)));

export default class SmartBit extends AbstractBatchableExplorer {

    protected getChunkSize(): number {
        return 200;
    }

    async fetch(addressesList: AddressesList): Promise<{address: string, addressContent: AddressValue}[]>{
        try {
            const addresses = Object.keys(addressesList);
            await wait(Math.floor(Math.random()*1000)); // Reduce number of concurrent requests

            let request = await fetch(`https://api.smartbit.com.au/v1/blockchain/address/` + addresses.join(","));
            const parsed = await request.json();

            if(!parsed || !parsed.success){
                throw new Error("SmartBit error");
            }
            const resultAddresses = new Map<string, AddressValue>();
            (addresses.length === 1 ? [parsed.address] : parsed.addresses).forEach(result => {
                resultAddresses.set(result.address, {
                    balance: result.confirmed.balance_int,
                    status: AddressStatusType.OK,
                    transactionCount: result.confirmed.transaction_count
                });
            });

            return Object.entries(addressesList).map(([address, addressContent]) => {
                return {
                    address,
                    addressContent: resultAddresses.get(address) || {
                        ...addressContent,
                        status: AddressStatusType.OK,
                    }
                };
            });
        } catch (e) {
            return Object.entries(addressesList).map(([address, addressContent]) => ({
                address,
                addressContent: {
                    ...addressContent,
                    status: AddressStatusType.ERROR,
                }
            }));
        }
    }
}
