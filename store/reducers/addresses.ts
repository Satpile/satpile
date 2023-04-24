import { AddressStatusType } from "../../components/AddressStatus";
import { Action } from "../actions/actions";
import { AddressesList } from "../../utils/Types";

const addresses = (state: AddressesList = {}, action: Action) => {
  switch (action.type) {
    case "LOAD_DATA":
      //We load the data from the disk, but first we filter out the old addresses that were deleted by checking each folder
      let existingAddress = new Set();
      action.state.folders.forEach((folder) =>
        folder.addresses.forEach((address) =>
          existingAddress.add(address.address)
        )
      );
      let filteredAddresses = {};
      Object.keys(action.state.addresses).forEach((address) => {
        //We iterate over stored addresses
        if (existingAddress.has(address)) {
          //If an address is held in at least one folder, then we keep it in the new object
          filteredAddresses[address] = { ...action.state.addresses[address] };
        }
      });
      return filteredAddresses;
    case "CLEAR":
      return {};
    case "ADD_ADDRESS":
      return {
        [action.address.address]: { balance: 0, status: AddressStatusType.NEW },
        ...state,
      };
    case "ADD_DERIVED_ADDRESSES":
      const newState = {};
      action.addresses.forEach((address) => {
        newState[address.address] = {
          balance: 0,
          status: AddressStatusType.NEW,
        };
      });
      return { ...newState, ...state };
    //If the state already contains that address, it won't be overwritten, thus avoiding an unnecessary balance reset to 0
    case "UPDATE_ADDRESSES":
      return { ...action.addresses };
    case "UPDATE_SINGLE_ADDRESS":
      return { ...state, [action.address]: action.addressContent };
  }
  return state;
};

export default addresses;
