import { ContractResult } from "../types/type"
import { State } from "../types/type"

declare const ContractError: any;
export const upVoteMessage = async (state: State, action: any): Promise<ContractResult> => {
    if (isNaN(action.input.messageId)) {
        throw new ContractError("No message id.");
    }
    state.messages.forEach(message => {
        if (message.id == action.input.messageId) {
            if (message.votes.likes.includes(action.caller)) {
                throw new ContractError("Caller has already voted.");
            }
            if (message.votes.dislikes.includes(action.caller)) {
                message.votes.dislikes = message.votes.dislikes.filter(caller => caller !== action.caller);
            }
            message.votes.likes.push(action.caller);
        }
    });
    return { state };
}
