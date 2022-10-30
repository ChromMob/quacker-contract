import { ContractResult, State } from "./types/type";
import { postMessage } from "./functions/postMessage";
import { upVoteMessage } from "./functions/upVoteMessage";
import { downVoteMessage } from "./functions/downVoteMessage";
import { readMessages } from "./functions/readMessages";
import { setUserName } from "./functions/setUserName";
import { setProfilePicture } from "./functions/setProfilePicture";

declare const ContractError: any;

export async function handle(state: State, action: any): Promise<ContractResult> {
    switch (action.input.function) {
        case "readMessages":
            return await readMessages(state, action);
        case 'postMessage':
            return await postMessage(state, action);
        case 'upVoteMessage':
            return await upVoteMessage(state, action);
        case 'downVoteMessage':
            return await downVoteMessage(state, action);
        case 'setUserName':
            return await setUserName(state, action);
        case 'setProfilePicture':
            return await setProfilePicture(state, action);
        default:
            throw new ContractError(`No function supplied or function not recognised: "${action.function}"`);
    }
}