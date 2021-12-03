import { combineReducers } from 'redux';
import WalletReducer from './walletreducer';
import FormReducer from './formreducer';

const reducer = combineReducers({
    wallet: WalletReducer,
    form: FormReducer,
});

export default reducer;
