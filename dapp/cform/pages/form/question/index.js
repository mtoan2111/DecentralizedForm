import React from 'react';
import { connect } from 'react-redux';
import styles from './question.module.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Router, { withRouter } from 'next/router';
import Notify from '../../../components/notify';

class Question extends React.Component {
    alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];
    questionType = [
        {
            id: 0,
            title: 'Yes/No question',
        },
        {
            id: 1,
            title: 'Choose one answer',
        },
        {
            id: 2,
            title: 'Choose multi answer',
        },
        {
            id: 3,
            title: 'Fill to the blank space',
        },
    ];
    qTypeId = null;
    onceAnswer = [];
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            openSnack: false,
            openLoading: false,
            snackMsg: '',
            alertType: 'success',
        };
    }

    onQuestionTypeChange = (e, newValue) => {
        if (newValue) {
            this.qTypeId = newValue.id;
        } else {
            this.qTypeId = null;
        }

        this.setState({
            isViewUpdated: !this.state.isViewUpdated,
        });
    };

    onCreateNewQuestion = () => {
        this.setState({
            openLoading: true,
        });
        const { query } = this.props.router;
        const formId = query.form_id;
        const { contract } = this.props.wallet;
        const { title } = this.state;
        if (this.qTypeId === null) {
            return this.onShowResult({
                type: 'error',
                msg: 'Question type could not be empty',
            });
        }

        if (title === '' || title === null) {
            return this.onShowResult({
                type: 'error',
                msg: 'Question title could not be empty',
            });
        }

        let meta = '';
        if (this.qTypeId !== 0 && this.qTypeId !== 3 && this.onceAnswer.length < 2) {
            return this.onShowResult({
                type: 'error',
                msg: 'The answer need to be greater than equal two',
            });
        }
        if (this.onceAnswer.length > 0) {
            let metas = [];
            let err = null;
            this.onceAnswer?.map((answer) => {
                if (answer.value === '') {
                    err = {
                        type: 'error',
                        msg: 'The answer could not be empty',
                    };
                }
                metas.push(answer.value?.trim?.());
            });
            if (err !== null) {
                return this.onShowResult(err);
            }
            if (metas.length !== new Set(metas).size) {
                return this.onShowResult({
                    type: 'error',
                    msg: 'The answer could not be dupplicated',
                });
            }
            meta = metas.join(';');
        }

        contract
            .new_question(
                {
                    formId,
                    type: this.qTypeId,
                    title,
                    meta,
                },
                300000000000000,
            )
            .then((question) => {
                if (question) {
                    this.qTypeId = null;
                    this.onceAnswer = [];
                    this.onShowResult({
                        type: 'success',
                        msg: 'New question has been added to this form',
                        title: '',
                    });
                } else {
                    this.onShowResult({
                        type: 'error',
                        msg: 'Create new question failure',
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.onShowResult({
                    type: 'error',
                    msg: err,
                });
            });
    };

    onCloseSnack = () => {
        this.setState({
            openSnack: false,
        });
    };

    onShowResult = ({ type, msg, title }) => {
        this.setState({
            openSnack: true,
            snackMsg: msg,
            title: title || this.state.title,
            alertType: type,
            openLoading: false,
        });
    };

    onFinishCreateQuestion = () => {
        const { query } = this.props.router;
        const formId = query.form_id;
        Router.push(`/form-detail?id=${formId}`);
    };

    onQuestionTitleChanged = (e) => {
        this.setState({
            title: e.target.value,
        });
    };

    onRenderQuestionType = () => {
        if (this.qTypeId !== null) {
            switch (this.qTypeId) {
                case 0:
                    return this.onRenderYesNoQuestion();
                case 1:
                    return this.onRenderOnceQuestion();
                case 2:
                    return this.onRenderOnceQuestion();
                case 3:
                    return this.onRenderFillQuestion();
                default:
                    return;
            }
        }
    };

    onRenderYesNoQuestion = () => {
        return (
            <div className={styles.question_block_content}>
                <div className={styles.question_block_title}>Your question</div>
                <div className={styles.question_block_input}>
                    <div className={styles.question_block_text_input_area}>
                        <input
                            className={styles.question_block_text_input}
                            placeholder={'Type your question title here'}
                            onChange={this.onQuestionTitleChanged}
                            value={this.title}
                        />
                    </div>
                    <div className={styles.question_block_input_item}>
                        <div className={styles.question_block_input_item_icon}>A</div>
                        <div className={styles.question_block_input_item_value}>True</div>
                    </div>
                    <div className={styles.question_block_input_item}>
                        <div className={styles.question_block_input_item_icon}>B</div>
                        <div className={styles.question_block_input_item_value}>False</div>
                    </div>
                </div>
            </div>
        );
    };

    onRenderFillQuestion = () => {
        return (
            <div className={styles.question_block_content}>
                <div className={styles.question_block_title}>Your question</div>
                <div className={styles.question_block_input}>
                    <div className={styles.question_block_text_input_area}>
                        <input
                            className={styles.question_block_text_input}
                            placeholder={'Type your question title here'}
                            onChange={this.onQuestionTitleChanged}
                            value={this.title}
                        />
                    </div>
                </div>
            </div>
        );
    };

    onAddNewOnceAnswer = () => {
        this.onceAnswer.push({ value: '' });
        this.setState({
            isViewUpdated: !this.state.isViewUpdated,
        });
    };

    onRemoveOnceAnswer = (index) => {
        this.onceAnswer.splice(index, 1);
        this.setState({
            isViewUpdated: !this.state.isViewUpdated,
        });
    };

    onOnceQuestionChangedValue = (e, answer) => {
        if (answer) {
            answer.value = e.target.value;
        }
        this.setState({
            isViewUpdated: !this.state.isViewUpdated,
        });
    };

    onRenderOnceQuestion = () => {
        return (
            <div className={styles.question_block_content}>
                <div className={styles.question_block_title}>Your question</div>
                <div className={styles.question_block_input}>
                    <div className={styles.question_block_text_input_area}>
                        <input
                            className={styles.question_block_text_input}
                            placeholder={'Type your question title here'}
                            onChange={this.onQuestionTitleChanged}
                            value={this.title}
                        />
                    </div>
                    {this.onceAnswer?.map?.((answer, index) => {
                        return (
                            <div key={index} className={styles.question_block_input_item}>
                                <div className={styles.question_block_input_item_icon}>{this.alphabet[index]}</div>
                                <div className={styles.question_block_input_item_value}>
                                    <input
                                        value={answer.value}
                                        onChange={(e) => this.onOnceQuestionChangedValue(e, answer)}
                                        className={styles.question_block_text_input_item}
                                    />
                                </div>
                                <button onClick={() => this.onRemoveOnceAnswer(index)} className={styles.question_block_remove_button}>
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
                <button onClick={this.onAddNewOnceAnswer} className={styles.question_block_new_button}>
                    + Add New Answer
                </button>
            </div>
        );
    };

    render() {
        const { openSnack, openLoading, snackMsg, alertType } = this.state;
        return (
            <>
                <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={this.onCloseSnack} />
                <div className={styles.root}>
                    <div className={styles.question_area}>
                        <h2>Create New Question</h2>
                        <div className={styles.question_block}>
                            <div className={styles.question_block_title}>Question Type</div>
                            <div className={styles.question_block_input}>
                                <Autocomplete
                                    className={styles.question_type_cbx}
                                    disablePortal
                                    id='combo-box-demo'
                                    options={this.questionType}
                                    getOptionLabel={(option) => option.title}
                                    sx={{ width: 300 }}
                                    onChange={this.onQuestionTypeChange}
                                    renderInput={(params) => <TextField {...params} className={styles.question_type_cbx} />}
                                />
                            </div>
                            {this.onRenderQuestionType()}
                            <div className={styles.question_block_btn_area}>
                                <button className={styles.question_block_btn_finish} onClick={this.onFinishCreateQuestion}>
                                    Finish
                                </button>
                                <button className={styles.question_block_btn_new} onClick={this.onCreateNewQuestion}>
                                    New Question
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(withRouter(Question));
