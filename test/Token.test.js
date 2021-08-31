const assert = require('assert');
const fs = require('fs');
const smartweave = require('smartweave');
const Arweave = require('arweave');

const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
});

const contract = JSON.parse(fs.readFileSync('./dist/Transaction.json'));
const wallet = JSON.parse(fs.readFileSync('.arweave.creds.json'));

describe('Amplify Token Tests', () => {
    it('Should read the account info of t8SwacamcLm-UITL769OUd8vQe37Wh08dCS_qiLsEPA', async () => {
        const input = { function: 'balance', target: 't8SwacamcLm-UITL769OUd8vQe37Wh08dCS_qiLsEPA' };
        const state = await smartweave.interactRead(arweave, wallet, contract.id, input);
        console.log(state);
    });
});