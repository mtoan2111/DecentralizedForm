import { CLEAR_FORM, UPDATE_FORM } from '../action/form';

const defaultState = {
    id: '',
    qCounter: '',
    title: '',
};

const FormReducer = (state = defaultState, content) => {
    const { type, value } = content;
    switch (type) {
        case CLEAR_FORM:
            return onClearForm();
        case UPDATE_FORM:
            return onUpdateForm(value);
        default:
            return state;
    }
};

const onClearForm = () => {
    return defaultState;
};

const onUpdateForm = ({ id, qCounter, title }) => {
    return {
        id,
        qCounter,
        title,
    };
};

export default FormReducer;
