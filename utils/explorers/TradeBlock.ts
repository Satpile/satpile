import { AddressStatusType } from "../../components/AddressStatus";
import { AddressValue, Explorer } from "../Types";
import AbstractExplorer from "./AbstractExplorer";

const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default class TradeBlock extends AbstractExplorer implements Explorer {
  isCoolDownImplemented(): boolean {
    return true;
  }

  protected getBaseCountdown(): number {
    return 1000 / 20; //20 req per second
  }

  async fetch(
    address: string,
    addressContent: AddressValue
  ): Promise<AddressValue> {
    try {
      await wait(Math.floor(Math.random() * 1000)); // Reduce number of concurrent requests
      let request = await fetch(
        `https://tradeblock.com/blockchain/api/v2.0/btc/balance/` + address
      );

      if (request.status !== 200) {
        throw new Error(request.status + "");
      }

      const [parsed] = await request.json();
      if (!parsed) {
        throw new Error("TradeBlock error");
      }
      let result = parsed.confirmed_bal * 1e8;
      const txCount = parsed.num_txns_confirmed;

      return {
        balance: result,
        status: AddressStatusType.OK,
        transactionCount: txCount,
      };
    } catch (e) {
      return {
        balance: addressContent.balance,
        status: AddressStatusType.ERROR,
        transactionCount: addressContent.transactionCount,
      };
    }
  }
}
