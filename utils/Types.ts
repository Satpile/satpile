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

export type FolderAddress = {
    name: string,
    address: string;
}

export type ListOrderType = "custom" | "alphabetically" | "alphabetically-desc";

export enum FolderType {
    SIMPLE = "SIMPLE",
    XPUB_WALLET = "XPUB_WALLET"
}

export type Folder = {
    uid: string;
    name: string;
    addresses: FolderAddress[];
    orderAddresses: ListOrderType;
    totalBalance: number;
    type?: FolderType;
}

export interface Explorer {
    fetchAndUpdate(AddressesList): Promise<AddressesBalanceDifference[]>
}

export enum ExplorerApi {
    MEMPOOL_SPACE = "MEMPOOL_SPACE",
    BLOCKSTREAM_INFO = "BLOCKSTREAM_INFO",
}
