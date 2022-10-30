import { ContractResult } from "../types/type"
import { State } from "../types/type"

declare const ContractError: any;
export const downVoteMessage = async (state: State, action: any): Promise<ContractResult> => {
    if (isNaN(action.input.messageId)) {
        throw new ContractError("No message id.");
    }
    state.messages.forEach(message => {
        if (message.id === action.input.messageId) {
            if (message.votes.dislikes.includes(action.caller)) {
                throw new ContractError("Caller has already voted.");
            }
            if (message.votes.likes.includes(action.caller)) {
                message.votes.likes = message.votes.likes.filter(caller => caller !== action.caller);
            }
            message.votes.dislikes.push(action.caller);
        }
    });
    return { state };
}
