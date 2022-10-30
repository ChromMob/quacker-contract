import fs from 'fs';
import path from 'path';
import { WarpFactory } from 'warp-contracts';

(async () => {
    const warp = WarpFactory.forMainnet();
    const contractSrc = fs.readFileSync(path.join(__dirname, '../contract.js'), 'utf8');
    const jwk = await warp.arweave.wallets.generate();
    console.log(jwk);
    console.log(await warp.arweave.wallets.jwkToAddress(jwk));
    const initialState = {
        messages: [],
        nameToAddress: {},
        addressToName: {},
        addressToImage: {}
    };

    console.log('Deployment started');
    const { contractTxId } = await warp.createContract.deploy({
        wallet: jwk,
        initState: JSON.stringify(initialState),
        src: contractSrc,
    });
    console.log('Deployment completed: ' + contractTxId);
})();
``;