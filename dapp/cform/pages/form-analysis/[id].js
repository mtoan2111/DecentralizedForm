import React from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Notify from '../../components/notify';
import styles from './formanalysis.module.css';

class FormAnalysisDetail extends React.Component {
    color = [
        'linear-gradient(135deg, #007AFF, #23D2FF)',
        'linear-gradient(135deg, #FFD3A5, #FD6585)',
        'linear-gradient(135deg, #FC3B63, #711DDF)',
        'linear-gradient(135deg, #69F9CC, #F8B0AD, #F6E884)',
        'linear-gradient(135deg, #EE9AB1, #FCFF00)',
        'linear-gradient(135deg, #EE9AE5, #5961F9)',
        '#FFD166',
        '#FA8F54',
    ];
    form = null;
    participants = [];
    participantRaws = [];
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMsg: '',
            alertType: 'success',
            openLoading: false,
        };
    }

    componentDidMount() {
        this.onGetForm();
    }

    onGetForm = () => {
        const { contract, walletConnection } = this.props.wallet;
        const { query } = this.props.router;
        const userId = walletConnection.getAccountId();
        const formId = query.id;
        contract
            ?.get_form?.({
                userId,
                id: formId,
            })
            .then((form) => {
                console.log(form);
                this.form = form;
                this.onGetParticipants();
                this.setState({
                    isUpdatedView: !this.state.isUpdatedView,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    onGetParticipants = () => {
        const { contract, walletConnection } = this.props.wallet;
        const { id, q_participant } = this.form;
        const num_page = parseInt(q_participant / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        this.participants = [];
        this.participantRaws = [];
        page_arr.map((page, index) => {
            contract
                .get_participants({
                    formId: id,
                    page: index + 1,
                })
                .then((data) => {
                    if (data) {
                        const pIndex = this.participantRaws.findIndex((x) => x?.page === data?.page);
                        if (pIndex === -1) {
                            this.participantRaws.push(data);
                            this.participantRaws.sort((a, b) => {
                                if (a.page < b.page) return -1;
                                if (a.page > b.page) return 1;
                                return 0;
                            });
                            let participants = [];
                            this.participantRaws.map((raw) => {
                                participants = [...participants, ...(raw?.data || [])];
                            });
                            this.participants = participants;
                            this.setState({
                                isViewUpdated: !this.state.isViewUpdated,
                            });
                        }
                    }
                });
        });
    };

    onParticipantDetailClicked = (participant) => {
        Router.push(`/participant-result?u=${participant}&id=${this.form.id}`);
    };

    onRenderParticipant = (participant, index) => {
        const shortName = `${participant?.[0]}${participant?.[1]}`;
        return (
            <div className={styles.participant_area} key={index} onClick={() => this.onParticipantDetailClicked(participant)}>
                <div
                    className={styles.participant_area_avata}
                    style={{
                        background: this.onRandomColorBg(),
                    }}>
                    {shortName}
                </div>
                <div className={styles.participant_area_name}>{participant}</div>
            </div>
        );
    };

    onRandomColorBg = () => {
        return this.color[Math.floor(Math.random() * 5)];
    };

    onRenderFormDetail = () => {
        if (this.form) {
            const { title, q_counter, q_participant } = this.form;
            return (
                <div className={styles.root}>
                    <div className={styles.your_form_title}>{title}</div>
                    <div className={styles.your_form_text}>Total Question(s): {q_counter}</div>
                    <div className={styles.your_form_text}>Total Participant(s): {q_participant}</div>
                    {this.participants?.length > 0 ? (
                        <div className={styles.participant_root}>
                            {this.participants?.map((part, index) => {
                                return this.onRenderParticipant(part, index);
                            })}
                        </div>
                    ) : (
                        <div className={styles.participant_root}>
                            <div className={styles.nothing_text}>Nothing to display</div>
                        </div>
                    )}
                </div>
            );
        } else {
            return <div>The form is not existed or You do not have permission to see this form analysis</div>;
        }
    };

    render() {
        const { openSnack, openLoading, snackMsg, alertType } = this.state;
        return (
            <>
                <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={this.onCloseSnack} />
                {this.onRenderFormDetail()}
            </>
        );
    }
}

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(withRouter(FormAnalysisDetail));
