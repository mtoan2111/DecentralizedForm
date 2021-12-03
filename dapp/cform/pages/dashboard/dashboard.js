import React from 'react';
import App from 'next/app';
import styles from './dashboard.module.css';
import SearchInput from '../../components/search/search';
import Router from 'next/router';
import Notify from '../../components/notify';

export default class Dashboard extends App {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            openLoading: false,
            snackMsg: '',
            alertType: 'success',
        };
    }

    onJoinForm = ({ id }) => {
        if (id === '') {
            return this.onShowResult({
                type: 'error',
                msg: 'Form id could not be empty',
            });
        }
        Router.push(`/form-answer?id=${id}`);
    };

    onShowResult = ({ type, msg }) => {
        this.setState({
            openSnack: true,
            snackMsg: msg,
            alertType: type,
            openLoading: false,
        });
    };

    onCloseSnack = () => {
        this.setState({
            openSnack: false,
        });
    };

    render() {
        const { openSnack, openLoading, snackMsg, alertType } = this.state;
        return (
            <>
                <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={this.onCloseSnack} />
                <div className={styles.root}>
                    <div className={styles.dashboard_join}>Join a form now</div>
                    <div className={styles.search_area}>
                        <SearchInput onSearch={this.onJoinForm} />
                    </div>
                </div>
            </>
        );
    }
}
