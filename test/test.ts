import ArLocal from 'arlocal';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { LoggerFactory, Warp, WarpFactory, Contract } from 'warp-contracts';
import { State } from '../types/type';
import fs from 'fs';
import path from 'path';

jest.setTimeout(30000);

describe('Testing the Atomic NFT Token', () => {

    let ownerWallet: JWKInterface;
    let owner: string;

    let user2Wallet: JWKInterface;
    let user2: string;

    let user3Wallet: JWKInterface;
    let user3: string;

    let initialState: State;

    let arlocal: ArLocal;
    let warp: Warp;
    let ardit: Contract<State>;

    let contractSrc: string;

    let contractId: string;

    beforeAll(async () => {
        arlocal = new ArLocal(1820, false);
        await arlocal.start();

        LoggerFactory.INST.logLevel('error');
        //LoggerFactory.INST.logLevel('debug', 'WasmContractHandlerApi');

        warp = WarpFactory.forLocal(1820);

        ({ jwk: ownerWallet, address: owner } = await warp.testing.generateWallet());

        ({ jwk: user2Wallet, address: user2 } = await warp.testing.generateWallet());

        ({ jwk: user3Wallet, address: user3 } = await warp.testing.generateWallet());

        initialState = {
            messages: [],
            nameToAddress: {},
            addressToName: {},
            addressToImage: {}
        };

        contractSrc = fs.readFileSync(path.join(__dirname, '../contract.js'), 'utf8');

        ({ contractTxId: contractId } = await warp.createContract.deploy({
            wallet: ownerWallet,
            initState: JSON.stringify(initialState),
            src: contractSrc,
        }));
        console.log('Deployed contract: ', contractId);
        ardit = warp.contract<State>(contractId).connect(ownerWallet);
    });

    afterAll(async () => {
        await arlocal.stop();
    });

    it('should properly deploy contract', async () => {
        const contractTx = await warp.arweave.transactions.get(contractId);

        expect(contractTx).not.toBeNull();
    });

    it('should read Ardit state', async () => {
        expect((await ardit.readState()).cachedValue.state).toEqual(initialState);
    });

    it('should properly post message', async () => {
        await ardit.writeInteraction({ function: 'postMessage', content: 'Hello world!' });

        const { cachedValue } = await ardit.readState();
        console.log(cachedValue.state);
        expect(cachedValue.state.messages[0]).toEqual({
            id: cachedValue.state.messages[0].id,
            timestamp: cachedValue.state.messages[0].timestamp,
            creator: owner,
            content: 'Hello world!',
            votes: { dislikes: [], likes: [] },
        });
    });

    it('should not post message with no content', async () => {
        await expect(ardit.writeInteraction({ function: 'postMessage' }, { strict: true })).rejects.toThrow(
            'Cannot create interaction: No content.'
        );
    });

    it("should properly upvote", async () => {
        console.log("Upvoting");
        await ardit.writeInteraction({ function: 'upVoteMessage', messageId: 0 });
        const { cachedValue } = await ardit.readState();
        console.log(cachedValue.state.messages[0].votes);
    });

    //     it('should not be possible for creator to vote for they message', async () => {
    //         await expect(ardit.writeInteraction({ function: 'upvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
    //             'Cannot create interaction: Message creator cannot vote for they own message.'
    //         );

    //         await expect(ardit.writeInteraction({ function: 'downvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
    //             'Cannot create interaction: Message creator cannot vote for they own message.'
    //         );
    //     });

    //     it('should not be possible to vote for non-existing message', async () => {
    //         ardit = warp.contract<State>(contractId).connect(user2Wallet);

    //         await expect(ardit.writeInteraction({ function: 'upvoteMessage', id: 5 }, { strict: true })).rejects.toThrow(
    //             'Cannot create interaction: Message does not exist.'
    //         );
    //     });

    //     it('should properly upvote message', async () => {
    //         ardit = warp.contract<State>(contractId).connect(user2Wallet);

    //         await ardit.writeInteraction({ function: 'upvoteMessage', id: 1 });

    //         const { cachedValue } = await ardit.readState();
    //         expect(cachedValue.state.messages[0].votes.status).toEqual(1);
    //     });

    //     it('should not be possible to vote for the same message twice', async () => {
    //         ardit = warp.contract<State>(contractId).connect(user2Wallet);

    //         await expect(ardit.writeInteraction({ function: 'upvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
    //             'Cannot create interaction: Caller has already voted.'
    //         );

    //         await expect(ardit.writeInteraction({ function: 'downvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
    //             'Caller has already voted.'
    //         );
    //     });

    //     it('should properly downvote message', async () => {
    //         ardit = warp.contract<State>(contractId).connect(user3Wallet);

    //         await ardit.writeInteraction({ function: 'downvoteMessage', id: 1 });

    //         const { cachedValue } = await ardit.readState();
    //         expect(cachedValue.state.messages[0].votes.likes.length).toEqual(0);
    //     });

    // it('should properly view message', async () => {
    //     const { cachedValue } = await ardit.readState();
    //     const { result } = await ardit.viewState({ function: 'readMessages' });

    //     expect(result).toEqual({
    //         id: cachedValue.state.messages[0].id,
    //         creator: owner,
    //         content: 'Hello world!',
    //         votes: { dislikes: [], likes: [] },
    //     });
    // });
});
