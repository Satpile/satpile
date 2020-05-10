import {AddressStatusType} from "../components/AddressStatus";

export type AddressValue = { status: AddressStatusType, balance: number };
export type AddressesList = {
    [address: string]: AddressValue
}
export type AddressesBalanceDifference = {
    address: string;
    before: AddressValue;
    after: AddressValue;
}

export interface Explorer {
    fetchAndUpdate(AddressesList): Promise<AddressesBalanceDifference[]>
}
