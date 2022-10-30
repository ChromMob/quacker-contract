import { ContractResult } from "../types/type"
import { State } from "../types/type"

declare const ContractError: any;
export const setUserName = async (state: State, action: any): Promise<ContractResult> => {
    if (action.input.name.length > 50) {
        throw new ContractError("Name is too long.");
    }
    if (state.nameToAddress[action.input.name] && state.nameToAddress[action.input.name] !== action.caller) {
        throw new ContractError("Name is already taken.");
    }
    state.addressToName[action.caller] = action.input.name;
    state.nameToAddress[action.input.name] = action.caller;
    if (action.input.picture) {
        state.addressToImage[action.caller] = action.input.picture;
    }
    return { state };
}
