import { ContractResult } from "../types/type"
import { State } from "../types/type"

declare const ContractError: any;
export const readMessages = async (state: State, action: any): Promise<ContractResult> => {
    if (isNaN(action.input.count)) {
        throw new ContractError("Not a number.");
    }

    const messages = state.messages.slice(state.messages.length - action.input.count, action.input.count);
    return { messages };
}
