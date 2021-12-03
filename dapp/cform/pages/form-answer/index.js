import React from 'react';
import YesNoQuestion from '../../components/question/yesno';
import OnceQuestion from '../../components/question/once';
import MultiQuestion from '../../components/question/multi';
import FillQuestion from '../../components/question/fill';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import styles from './form.module.css';
import Notify from '../../components/notify';

class FormAnswer extends React.Component {
    formId = '';
    maxQuestion = 0;
    answerIndex = -1;
    question = {};
    constructor(props) {
        super(props);
        this.state = {
            // loading: true,
            mess: '',
            openSnack: false,
            openLoading: true,
            snackMsg: '',
            alertType: 'success',
        };
    }

    componentDidMount() {
        try {
            const { contract, walletConnection, nearConfig } = this.props.wallet;
            if (!walletConnection.isSignedIn()) {
                return walletConnection?.requestSignIn?.(nearConfig?.contractName);
            }
            const { query } = this.props.router;
            const { id } = query;
            this.formId = id;
            const userId = walletConnection.getAccountId();
            this.onLoadingQuestion({ formId: id, userId });
        } catch (err) {
            console.log(err);
            this.onLoadingCompleted();
        }
    }

    onLoadingQuestion = ({ formId, userId }) => {
        this.setState({
            loading: true,
        });
        this.question = null;
        const { contract } = this.props.wallet;
        contract
            .get_question({
                formId,
                userId,
            })
            .then((question) => {
                if (question) {
                    this.question = question;
                    this.onLoadingCompleted();
                } else {
                    this.question = {};
                    this.onLoadingCompleted();
                }
            })
            .catch((err) => {
                console.log(err);
                this.question = {};
                this.onLoadingCompleted();
            });
    };

    onGetNextQuestion = () => {
        const { walletConnection } = this.props.wallet;
        const { query } = this.props.router;
        const { id } = query;
        const userId = walletConnection.getAccountId();
        this.onLoadingQuestion({ formId: id, userId });
    };

    onLoadingCompleted = () => {
        this.setState({
            openLoading: false,
        });
    };

    onSubmitAnswer = ({ formId, questionId, answer }) => {
        const { contract } = this.props.wallet;
        if (typeof answer === 'undefined' || answer === null || answer === '') {
            return this.onShowResult({
                type: 'error',
                msg: 'A',
            });
        }

        this.setState({
            openLoading: true,
        });

        contract
            .submit_answer(
                {
                    formId,
                    questionId,
                    answer,
                },
                300000000000000,
            )
            .then((ret) => {
                if (ret) {
                    this.onShowResult({
                        type: 'success',
                        msg: 'Answer has been submited',
                    });
                } else {
                    this.onShowResult({
                        type: 'error',
                        msg: 'Submit question failure Or The question has been deleted on time',
                    });
                }
                this.onGetNextQuestion();
            })
            .catch((err) => {
                this.onShowResult({
                    type: 'error',
                    msg: String(err),
                });
            });
    };

    onCloseSnack = () => {
        this.setState({
            openSnack: false,
        });
    };

    onShowResult = ({ type, msg }) => {
        this.setState({
            openSnack: true,
            snackMsg: msg,
            alertType: type,
            openLoading: false,
        });
    };

    onRenderQuestion = () => {
        if (this.question !== null) {
            const { id, type, title, meta } = this.question;
            switch (type) {
                case 0:
                    return (
                        <YesNoQuestion
                            formId={this.formId}
                            id={id}
                            title={title}
                            meta={meta}
                            onNext={this.onNextQuestionBtnClicked}
                            onSubmitAnswer={this.onSubmitAnswer}
                        />
                    );
                case 1:
                    return (
                        <OnceQuestion
                            formId={this.formId}
                            id={id}
                            title={title}
                            meta={meta}
                            onNext={this.onNextQuestionBtnClicked}
                            onSubmitAnswer={this.onSubmitAnswer}
                        />
                    );
                case 2:
                    return (
                        <MultiQuestion
                            formId={this.formId}
                            id={id}
                            title={title}
                            meta={meta}
                            onNext={this.onNextQuestionBtnClicked}
                            onSubmitAnswer={this.onSubmitAnswer}
                        />
                    );
                case 3:
                    return (
                        <FillQuestion
                            formId={this.formId}
                            id={id}
                            title={title}
                            meta={meta}
                            onNext={this.onNextQuestionBtnClicked}
                            onSubmitAnswer={this.onSubmitAnswer}
                        />
                    );
                default:
                    return this.onRenderNoQuestion();
            }
        }
        return this.onRenderNoQuestion();
    };

    onRenderLoadingQuestion = () => {};

    onViewResultClicked = () => {
        const { walletConnection } = this.props.wallet;
        const userId = walletConnection.getAccountId();
        Router.push(`/participant-result?u=${userId}&id=${this.formId}`);
    };

    onRenderNoQuestion = () => {
        return (
            <div className={styles.no_question_area}>
                Your exam has already done. View your result{' '}
                <span className={styles.result_link} onClick={this.onViewResultClicked}>
                    now
                </span>
            </div>
        );
    };

    render() {
        const { openSnack, openLoading, snackMsg, alertType } = this.state;
        return (
            <>
                <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={this.onCloseSnack} />
                <div className={styles.root}>{this.onRenderQuestion()}</div>
            </>
        );
    }
}

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(withRouter(FormAnswer));
