import React from 'react';
import styles from './confirmation.module.css';

export default class Confirmation extends React.Component {
    onCancelBtnClicked = () => {
        this.props?.onDeny();
    };

    onAcceptBtnClicked = () => {
        this.props?.onAccept();
    };
    render() {
        return (
            <div className={styles.root}>
                <h2>Warning!!!</h2>
                <div className={styles.action_title}> Are you sure to make this action?</div>
                <div className={styles.action_area}>
                    <button className={styles.action_btn_confirm} onClick={this.onAcceptBtnClicked}>
                        OK
                    </button>
                    <button className={styles.action_btn} onClick={this.onCancelBtnClicked}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
}
