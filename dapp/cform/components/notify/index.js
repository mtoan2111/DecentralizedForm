import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '../alert';
import Loading from '../loading';
import styles from './notify.module.css';

export default class Notify extends React.Component {
    render() {
        const { openSnack, snackMsg, alertType, openLoading, onClose } = this.props;
        return (
            <>
                <Loading open={openLoading} />
                <Snackbar
                    open={openSnack}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    className={styles.snack_area}
                    autoHideDuration={3000}
                    onClose={onClose}>
                    <Alert onClose={onClose} sx={{ width: '100%' }} severity={alertType}>
                        {snackMsg}
                    </Alert>
                </Snackbar>
            </>
        );
    }
}
