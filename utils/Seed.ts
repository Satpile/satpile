import * as Crypto from "expo-crypto";
import { mnemonicToSeed, entropyToMnemonic } from "bip39";
import { bip32 } from "./BitcoinJS";

const bip84Constants = {
  bitcoin: {
    public: 0x04b24746,
    path: "m/84'/0'/0'",
  },
  testnet: {
    public: 0x045f1cf6,
    path: "m/84'/1'/0'",
  },
};

export async function generatePrivateWallet(): Promise<{
  mnemonic: string;
  zpub: string;
}> {
  const bytes = Buffer.from(Crypto.getRandomBytes(16));
  const mnemonic = entropyToMnemonic(bytes);
  const seed = await mnemonicToSeed(mnemonic);
  const derivedNode = bip32
    .fromSeed(seed)
    .derivePath(bip84Constants.bitcoin.path);
  const zpub = derivedNode.neutered().toBase58(bip84Constants.bitcoin.public);

  return { mnemonic, zpub };
}
