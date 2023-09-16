import * as Crypto from "expo-crypto";
import {
  mnemonicToSeed,
  entropyToMnemonic,
  getDefaultWordlist,
  wordlists,
} from "bip39";
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

export async function generatePrivateWallet(passphrase?: string): Promise<{
  mnemonic: string;
  zpub: string;
}> {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  const mnemonic = entropyToMnemonic(Buffer.from(randomBytes));

  const zpub = await generateZpubFromMnemonic(mnemonic, passphrase);

  return { mnemonic, zpub };
}

export async function generateMnemonic(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  const mnemonic = entropyToMnemonic(Buffer.from(randomBytes));

  return mnemonic;
}

export async function generateZpubFromMnemonic(
  mnemonic: string,
  passphrase?: string
): Promise<string> {
  const seed = await mnemonicToSeed(
    mnemonic,
    passphrase ? passphrase : undefined
  );
  const derivedNode = bip32
    .fromSeed(seed)
    .derivePath(bip84Constants.bitcoin.path);
  const zpub = derivedNode.neutered().toBase58(bip84Constants.bitcoin.public);

  return zpub;
}

export function generateSeedQRDataFromMnemonic(mnemonic: string): string {
  const wordlistName = getDefaultWordlist();
  const wordlist = wordlists[wordlistName];
  if (!wordlist) {
    throw new Error("Invalid wordlist " + wordlistName);
  }

  const mnemonicWords = mnemonic.split(" ");
  const indexes = mnemonicWords.map((word) => wordlist.indexOf(word));
  const paddedIndexes = indexes.map((index) =>
    index.toString().padStart(4, "0")
  );
  return paddedIndexes.join("");
}

export function generateMnemonicFromSeedQRData(
  seedQRData: string
): string | undefined {
  console.log("generateMnemonicFromSeedQRData", seedQRData);
  const wordlistName = getDefaultWordlist();
  const wordlist = wordlists[wordlistName];
  if (!wordlist) {
    throw new Error("Invalid wordlist " + wordlistName);
  }

  // data should be a string of 12 or 24 4-digit indexes
  if (seedQRData.length !== 12 * 4 && seedQRData.length !== 24 * 4) {
    throw new Error("Invalid seed QR data");
  }

  if (!/^[0-9]+$/.test(seedQRData)) {
    throw new Error("Invalid seed QR data");
  }

  const indexes = [];
  for (let i = 0; i < seedQRData.length; i += 4) {
    const index = parseInt(seedQRData.slice(i, i + 4));
    if (index >= wordlist.length) {
      throw new Error("Invalid seed QR data (index out of range)");
    }
    indexes.push(index);
  }

  const mnemonicWords = indexes.map((index) => wordlist[index]);
  return mnemonicWords.join(" ");
}
