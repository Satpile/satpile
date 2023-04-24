import {
  AddressesBalanceDifference,
  AddressesList,
  AddressValue,
  Explorer,
} from "../Types";
import store from "../../store/store";
import { generateUid } from "../Helper";
import { requestsDebouncer } from "../RequestDebouncer";
import * as Actions from "../../store/actions";

export default abstract class AbstractBatchableExplorer implements Explorer {
  abstract fetch(
    addressesList: AddressesList
  ): Promise<{ address: string; addressContent: AddressValue }[]>;
  needsTor(): boolean {
    return false;
  }

  protected abstract getChunkSize(): number;

  protected async runQueries(
    addresses: AddressesList
  ): Promise<AddressesBalanceDifference[]> {
    const dispatch = store.dispatch;
    const diff: AddressesBalanceDifference[] = [];

    const requestUniqId = generateUid();

    Object.keys(addresses).forEach(
      (address) => (requestsDebouncer[address] = requestUniqId)
    );
    //we set this request as the most recent request for these addresses

    const addressesValues = await this.fetch(addresses);

    addressesValues.forEach(({ address, addressContent: result }) => {
      const addressContent = addresses[address];
      if (requestUniqId !== requestsDebouncer[address]) {
        // In the meantime, if the requestId coresponding to this address has changed,
        // it means this request is obsolete. We ignore it.
        return;
      }
      delete requestsDebouncer[address]; //clean debouncer

      if (
        addressContent.balance !== result.balance ||
        addressContent.transactionCount !== result.transactionCount
      ) {
        //We store all the differences
        diff.push({
          address: address,
          before: addressContent,
          after: result,
        });
      }

      if (
        addressContent.balance !== result.balance ||
        addressContent.status !== result.status ||
        addressContent.transactionCount !== result.transactionCount
      ) {
        //We only update the state if the result has changed
        dispatch(Actions.updateSingleAddressBalance(address, result));
      }

      return result;
    });

    return diff;
  }

  async fetchAndUpdate(
    addresses: AddressesList
  ): Promise<AddressesBalanceDifference[]> {
    const chunkSize = this.getChunkSize();
    const list = Object.entries(addresses);
    const chunkList: AddressesList[] = [];

    list.forEach(([address, addressValue], index) => {
      if (index % chunkSize === 0) {
        chunkList.push({});
      }
      chunkList[chunkList.length - 1][address] = addressValue;
    });

    return (
      await Promise.all(
        chunkList.map((addresses) => this.runQueries(addresses))
      )
    ).flatMap((v) => v);
  }
}
