export const UPDATE_WALLET = "update_wallet";
export const CLEAR_WALLET = "clear_wallet";

export const onUpdateWallet = (data) => {
    return {
        type: UPDATE_WALLET,
        value: data,
    };
};

export const onClearWallet = () => {
    return {
        type: CLEAR_WALLET,
    };
};
