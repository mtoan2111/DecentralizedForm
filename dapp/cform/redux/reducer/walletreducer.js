import { CLEAR_WALLET, UPDATE_WALLET } from "../action/wallet";

const defaultState = {
    contract: {},
    currentUser: {},
    nearConfig: {},
    walletConnection: {},
};

const WalletReducer = (state = defaultState, content) => {
    const { type, value } = content;
    switch (type) {
        case CLEAR_WALLET:
            return onClearWallet();
        case UPDATE_WALLET:
            return onUpdateWallet(value);
        default:
            return state;
    }
};

const onClearWallet = () => {
    return defaultState;
};

const onUpdateWallet = ({ contract, currentUser, nearConfig, walletConnection }) => {
    return {
        contract,
        currentUser,
        nearConfig,
        walletConnection,
    };
};

export default WalletReducer;
