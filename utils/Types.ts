import { AddressStatusType } from "../components/AddressStatus";
import { Ionicons } from "@expo/vector-icons";

export type Icons = React.ComponentProps<typeof Ionicons>["name"];

export type AddressValue = {
  status: AddressStatusType;
  balance: number;
  transactionCount?: number;
};
export type AddressesList = {
  [address: string]: AddressValue;
};
export type AddressesBalanceDifference = {
  address: string;
  before: AddressValue;
  after: AddressValue;
};

export type FolderAddress = {
  name: string;
  address: string;
  derivationPath?: string;
};

export type ListOrderType = "custom" | "alphabetically" | "alphabetically-desc";

export enum FolderType {
  SIMPLE = "SIMPLE",
  XPUB_WALLET = "XPUB_WALLET",
}

export type FolderXPubBranch = {
  nextPath: string;
  addresses: FolderAddress[]; // Holds addresses corresponding to given branch (ex 0/0 or 1/0)
};

export type Folder = {
  uid: string;
  version?: "v2"; //used in migrations (LOAD_DATA action)
  name: string;
  addresses: FolderAddress[]; //backward compatibility
  orderAddresses: ListOrderType;
  totalBalance: number;
  type?: FolderType;
  address?: string; //If type is xpub_wallet, the folder has an address
  xpubConfig?: {
    /**
     * @deprecated
     */
    nextPath?: string;
    branches?: FolderXPubBranch[];
  };
  seed?: string;
  seedPassphrase?: string;
};

export interface Explorer {
  fetchAndUpdate(AddressesList): Promise<AddressesBalanceDifference[]>;
  needsTor(): boolean;
}

export interface CustomExplorerOptions {
  type: "electrum";
  options: ElectrumOptions;
}

export interface ElectrumOptions {
  host: string;
  port: number;
  protocol: "tls" | "tcp";
}

export interface MempoolOptions {
  url: string;
}

export enum ExplorerApi {
  MEMPOOL_SPACE = "MEMPOOL_SPACE",
  BLOCKSTREAM_INFO = "BLOCKSTREAM_INFO",
  TRADEBLOCK_COM = "TRADEBLOCK_COM",
  BLOCKCYPHER_COM = "BLOCKCYPHER_COM",
  SMARTBIT_COM_AU = "SMARTBIT_COM_AU",
  MEMPOOL_SPACE_ONION = "MEMPOOL_SPACE_ONION",
  ELECTRUM_BLOCKSTREAM = "ELECTRUM_BLOCKSTREAM",
  CUSTOM = "CUSTOM",
}

export enum AddingEnum {
  XPUB_WALLET = "XPUB_WALLET",
  XPUB_WALLET_WITH_SEED = "XPUB_WALLET_WITH_SEED",
  ADDRESS = "ADDRESS",
}

export type SecuritySetting =
  | {
      enableBiometrics: false;
      passphrase: null;
    }
  | {
      enableBiometrics: boolean;
      passphrase: string;
    };

export interface Settings {
  locale: string;
  refresh: number;
  darkMode: boolean;
  foldersOrder: ListOrderType;
  security: SecuritySetting;
  explorer: ExplorerApi;
  explorerOption?: CustomExplorerOptions;
  displayUnit?: "sats" | "bitcoin";
  hideEmptyAddresses?: boolean;
}

export const REFRESH_TASK = "REFRESH_TASK";
