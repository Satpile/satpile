import bcrypt from "react-native-bcrypt";
import isaac from "isaac";

bcrypt.setRandomFallback((len) => {
  const buf = new Uint8Array(len);

  return buf.map(() => Math.floor(isaac.random() * 256));
});

export const hashPassword = async (plainText: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainText, 8, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

export const checkPassword = async (
  plainText: string,
  hash: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainText, hash, function (err, res) {
      if (err) reject(err);
      resolve(res);
    });
  });
};
