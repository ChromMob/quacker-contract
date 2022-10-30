import { ContractResult } from "../types/type"
import { State } from "../types/type"

declare const ContractError: any;
export const setProfilePicture = async (state: State, action: any): Promise<ContractResult> => {
    state.addressToImage[action.caller] = action.input.picture;
    return { state };
}
