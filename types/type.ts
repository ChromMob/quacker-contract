export interface State {
    messages: Message[];
    nameToAddress: { [name: string]: string };
    addressToName: { [address: string]: string };
    addressToImage: { [address: string]: string };
}

export interface Message {
    id: number;
    image?: string;
    creator: string;
    content: string;
    timestamp: number;
    votes: {
        dislikes: string[];
        likes: string[];
    };
    comments: Message[];
}



export type ContractResult = { state: State } | { messages: Message[] };