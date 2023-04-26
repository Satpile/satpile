import { AddressStatusType } from "../../components/AddressStatus";
import { AddressValue, Explorer } from "../Types";
import AbstractExplorer from "./AbstractExplorer";
import { torClient } from "../TorManager";

export default class Mempool extends AbstractExplorer implements Explorer {
  constructor(public url: string, public cooldown: number = 0) {
    super();
  }

  public isCoolDownImplemented(): boolean {
    return true;
  }

  protected getBaseCountdown(): number {
    return this.cooldown;
  }

  private async fetchTor(url: string) {
    await torClient.startIfNotStarted();
    return torClient.get(url);
  }

  needsTor(): boolean {
    return this.url.endsWith(".onion");
  }

  async fetch(
    address: string,
    addressContent: AddressValue
  ): Promise<AddressValue> {
    try {
      let request;
      let parsed;
      if (this.url.endsWith(".onion")) {
        request = await this.fetchTor(`${this.url}/api/address/` + address);
        parsed = request.json;
        if (request.respCode !== 200) {
          throw new Error(request.status + "");
        }
      } else {
        request = await fetch(`${this.url}/api/address/` + address);
        const text = await request.text();
        parsed = JSON.parse(text);
        if (request.status !== 200) {
          console.error("error", request.status, text);
          throw new Error(request.status + "");
        }
      }

      let result =
        parsed.chain_stats.funded_txo_sum - parsed.chain_stats.spent_txo_sum;
      const txCount = parsed.chain_stats.tx_count;

      return {
        balance: result,
        status: AddressStatusType.OK,
        transactionCount: txCount,
      };
    } catch (e) {
      console.log(e);
      return {
        balance: addressContent.balance,
        status: AddressStatusType.ERROR,
        transactionCount: addressContent.transactionCount,
      };
    }
  }
}
