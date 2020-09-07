import {AddressStatusType} from "../components/AddressStatus";

export type AddressValue = {
    status: AddressStatusType,
    balance: number,
    transactionCount?: number
};
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
    derivationPath?: string;
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
    address?: string; //If type is xpub_wallet, the folder has an address
    xpubConfig?: {
        nextPath: string
    }
}

export interface Explorer {
    fetchAndUpdate(AddressesList): Promise<AddressesBalanceDifference[]>
}

export enum ExplorerApi {
    MEMPOOL_SPACE = "MEMPOOL_SPACE",
    BLOCKSTREAM_INFO = "BLOCKSTREAM_INFO",
}

export enum AddingEnum {
    XPUB_WALLET = "XPUB_WALLET",
    ADDRESS = "ADDRESS"
}
