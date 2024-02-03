import { getPrivateKeyFromMnemonicAndPath } from "./Seed";
import bitcoinMessage from "bitcoinjs-message";

export const signMessage = async (
  message: string,
  {
    seed,
    passphrase,
    derivationPath,
  }: { seed: string; passphrase?: string; derivationPath: string }
) => {
  const node = await getPrivateKeyFromMnemonicAndPath({
    mnemonic: seed,
    passphrase,
    addressPath: derivationPath,
  });
  if (!node || !node.privateKey) throw new Error("Invalid private key");

  const signature = await bitcoinMessage.signAsync(
    message,
    node.privateKey,
    true
  );

  return signature.toString("base64");
};

export const verifyMessage = async ({
  message,
  signature,
  address,
}: {
  message: string;
  signature: string;
  address: string;
}) => {
  return bitcoinMessage.verify(message, address, signature, undefined, true);
};
