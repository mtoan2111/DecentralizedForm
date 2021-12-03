export const UPDATE_FORM = 'update_form';
export const CLEAR_FORM = 'clear_form';

export const onUpdateForm = (data) => {
    return {
        type: UPDATE_FORM,
        value: data,
    };
};

export const onClearForm = () => {
    return {
        type: CLEAR_FORM,
    };
};
