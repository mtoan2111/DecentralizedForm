import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default class Loading extends React.Component {
    render() {
        const { open } = this.props;
        return (
            <Backdrop sx={{ color: '#fff', zIndex: 9999999 }} open={open}>
                <CircularProgress color='inherit' />
            </Backdrop>
        );
    }
}
