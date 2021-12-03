import { connect, Contract, keyStores, WalletConnection, Account } from 'near-api-js';
import getConfig from './config';
import * as nearAPI from 'near-api-js';

const nearConfig = getConfig('testnet');

export async function initContract() {
    const near = await nearAPI.connect({
        deps: {
            keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
        },
        ...nearConfig,
    });

    const walletConnection = new nearAPI.WalletConnection(near);

    let currentUser;

    // Account.state();

    if (walletConnection.getAccountId()) {
        currentUser = {
            accountId: walletConnection.getAccountId(),
            balance: (await walletConnection.account().state()).amount,
        };
    }

    const contract = await new nearAPI.Contract(walletConnection.account(), nearConfig.contractName, {
        viewMethods: ['get_forms', 'get_form_count', 'get_form', 'get_question', 'get_questions', 'get_participants', 'get_question_count'],
        changeMethods: [
            'init_new_form',
            'new_question',
            'submit_answer',
            'update_question',
            'update_form',
            'delete_form',
            'delete_question',
            'get_answer_statistical',
        ],
        sender: walletConnection.getAccountId(),
    });

    return { contract, currentUser, nearConfig, walletConnection };
}
