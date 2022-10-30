import { ContractResult } from "../types/type"
import { State, Message } from "../types/type"

declare const ContractError: any;
export const postMessage = async (state: State, action: any): Promise<ContractResult> => {
    if (!action.input.content?.trim()) {
        throw new ContractError("No content.");
    }
    if (action.input.timestamp > Date.now()) {
        throw new ContractError("Timestamp cannot be in the future.");
    }
    let message: Message = {
        id: state.messages.length || 0,
        timestamp: action.input.timestamp,
        creator: action.caller,
        content: action.input.content,
        votes: {
            dislikes: [],
            likes: []
        },
        comments: []
    }

    if (action.input.image) {
        message.image = action.input.image;
    }

    state.messages.push(message);
    return { state };
}
