import React from 'react';
import styles from './account.module.css';
import { connect } from 'react-redux';
import { Popover } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowDropDownCircleSharpIcon from '@mui/icons-material/ArrowDropDownCircleSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import Router, { withRouter } from 'next/router';

class UserAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            popoverId: undefined,
            popoverOpen: false,
        };
    }

    onRequestConnectWallet = () => {
        const { nearConfig, walletConnection } = this.props.wallet;
        walletConnection?.requestSignIn?.(nearConfig?.contractName);
    };

    onRequestSignOut = () => {
        const { walletConnection } = this.props.wallet;
        const { pathname } = this.props.router;
        walletConnection.signOut();
        Router.push('/');
    };

    onRenderSignInButton = () => {
        return (
            <div className={styles.signIn_area}>
                <button className={styles.signIn_button} onClick={this.onRequestConnectWallet}>
                    SignIn
                </button>
            </div>
        );
    };

    onOpenAccountPopover = (e) => {
        this.setState({
            anchorEl: e.target,
            popoverOpen: true,
            popoverId: 'simple-popover',
        });
    };

    onCloseAccountPopover = () => {
        this.setState({
            anchorEl: null,
            popoverOpen: false,
            popoverId: undefined,
        });
    };

    onRenderAccountDetail = () => {
        const { walletConnection } = this.props.wallet;
        const { anchorEl, popoverOpen, popoverId } = this.state;
        const accountId = walletConnection?.getAccountId?.();
        let popoverRight = 1000;
        if (typeof window !== 'undefined') {
            popoverRight = window?.screen?.width - 15;
        }
        return (
            <div className={styles.signIn_area}>
                <button className={styles.account_button} onClick={this.onOpenAccountPopover}>
                    <div className={styles.account_button_icon_area}>
                        <AccountCircleOutlinedIcon className={styles.account_button_icon} />
                    </div>
                    <div className={styles.account_button_accountId_area}>{accountId}</div>
                    <div>
                        <ArrowDropDownCircleSharpIcon className={styles.account_button_drop_icon} />
                    </div>
                </button>
                <Popover
                    id={popoverId}
                    open={popoverOpen}
                    anchorEl={anchorEl}
                    onClose={this.onCloseAccountPopover}
                    anchorReference='anchorPosition'
                    anchorPosition={{ top: 70, left: popoverRight }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    className={styles.popover_container}>
                    <div className={styles.signOut_area}>
                        <button className={styles.signOut_button} onClick={this.onRequestSignOut}>
                            <LogoutSharpIcon className={styles.signOut_button_icon} />
                            <div className={styles.signOut_button_content}>Logout</div>
                        </button>
                    </div>
                </Popover>
            </div>
        );
    };

    onRenderScene = () => {
        const { walletConnection } = this.props.wallet;
        const isSigned = walletConnection?.isSignedIn?.();
        if (isSigned) {
            return this.onRenderAccountDetail();
        }
        return this.onRenderSignInButton();
    };

    render() {
        return <div className={styles.root}>{this.onRenderScene()}</div>;
    }
}

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(withRouter(UserAccount));
