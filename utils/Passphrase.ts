import bcrypt from "react-native-bcrypt";
import isaac from "isaac";

bcrypt.setRandomFallback((len): number[] => {
  const r = [];
  for (let i = 0; i < len; i++) {
    r.push(Math.floor(isaac.random() * 256));
  }
  return r;
});

export const hashPassword = async (plainText: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainText, 8, function (err, hash) {
      if (err) {
        reject(err);
        return;
      }
      if (!hash) {
        reject("No hash");
        return;
      }
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
