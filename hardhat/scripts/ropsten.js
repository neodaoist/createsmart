const {ethers}                            = require('ethers');
const {ImmutableXClient, ERC721TokenType} = require('@imtbl/imx-sdk');

const publicApiUrl                = 'https://api.ropsten.x.immutable.com/v1';
const starkContractAddress        = '0x4527be8f31e2ebfbef4fcaddb5a17447b27d2aef';
const registrationContractAddress = '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864';
const provider                    = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/frsWxvDNGt-hrTm8O87hWEqrDiq8i-c1');

async function run() {
    const params = process.argv.slice(2);

    // 0 : action , 1 : private key

    const minter = new ethers.Wallet(params[1]).connect(provider);

    const minterClient = await ImmutableXClient.build({
        publicApiUrl,
        signer: minter,
        starkContractAddress,
        registrationContractAddress,
    });

    let promise = null;

    if (params[0] === 'mint') {
        /*
         * Mint
         * 2 : contract, 3 : to, 4 : tokenId
         */

        promise = minterClient.mintV2([{
            contractAddress: params[2].toLowerCase(),
            users:           [{
                etherKey: params[3].toLowerCase(),
                tokens:   [
                    {id: params[4], blueprint: 'empty'}
                ]
            }],
        }]);
    } else if (params[0] === 'sell') {
        /*
         * Sell
         * 2: contract, 3: tokenId, 4: price, 5: user
         */

        promise = minterClient.createOrder({
            amountBuy:  (params[4] * 1000000000000000000).toString(),
            amountSell: 1,
            tokenBuy:   {
                type: 'ETH',
                data: {decimals: 18}
            },
            tokenSell:  {
                type: 'ERC721',
                data: {tokenId: params[3], tokenAddress: params[2]}
            },
            user:       params[5].toLowerCase()
        });

    } else if (params[0] === 'cancel-sell') {
        /*
         * Sell
         * 2: orderId
         */

        promise = minterClient.cancelOrder(params[2])();

    } else if (params[0] === 'transfer') {
        /*
         * Sell
         * 2: contract, 3: tokenId, 4: sender, 5: receiver
         */

        promise = minterClient.transfer({
            sender:   params[4],
            token:    {
                type: 'ERC721',
                data: {tokenId: params[3], tokenAddress: params[2]}
            },
            quantity: 1,
            receiver: params[5]
        });

    } else {
        console.log('KO:unknown action');
    }

    if (promise) {
        await promise
            .then((response) => {
                console.log('OK');
            })
            .catch((error) => {
                console.log('KO:' + error);
            });
    }
}

run();
