import { withRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import styles from './formdetail.module.css';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import EditQuestionModal from '../../components/modal/editquestion';
import ConfirmationModel from '../../components/modal/confirmation';
import EditFormModal from '../../components/modal/editform';
import Router from 'next/router';
import Notify from '../../components/notify';
import Tooltip from '@mui/material/Tooltip';

class FormDetail extends React.Component {
    type = ['Yes/No question', 'Choose one answer', 'Choose multi answer', 'Fill to the blank space'];
    alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];
    formId = '';
    form = {};
    max_question = 0;
    raws = [];
    questions = [];
    editingQuestion = {};
    removingQuestion = {};
    removingForm = {};

    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            err: false,
            err_msg: '',
            title: '',
            qCounter: 0,
            openEditModal: false,
            openRemoveQuestionModal: false,
            openRemoveFormModal: false,
            openSnack: false,
            openEditFormTitleModal: false,
            snackMsg: '',
            alertType: 'success',
            openLoading: false,
        };
    }

    componentDidMount() {
        this.getFormDetail();
    }

    getFormDetail = () => {
        const { query } = this.props.router;
        const { contract, walletConnection } = this.props.wallet;
        const { id, c } = query;
        const userId = walletConnection.getAccountId();
        contract
            .get_form({
                userId,
                id,
            })
            .then((form) => {
                if (form) {
                    this.form = form;
                    const { id, title, q_counter } = form;
                    this.formId = id;
                    this.getAllQuestion(q_counter);
                    this.setState({
                        step: 1,
                        title,
                        qCounter: q_counter,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    getAllQuestion = (total) => {
        const { contract, walletConnection } = this.props.wallet;
        const num_page = parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        const userId = walletConnection.getAccountId();
        this.questions = [];
        this.raws = [];
        page_arr.map((page, index) => {
            contract
                .get_questions({
                    userId,
                    formId: this.formId,
                    page: index + 1,
                })
                .then((data) => {
                    if (data) {
                        const pIndex = this.raws.findIndex((x) => x?.page === data?.page);
                        if (pIndex === -1) {
                            this.raws.push(data);
                            this.raws.sort((a, b) => {
                                if (a.page < b.page) return -1;
                                if (a.page > b.page) return 1;
                                return 0;
                            });
                            let questions = [];
                            this.raws.map((raw) => {
                                questions = [...questions, ...(raw?.data || [])];
                            });
                            this.questions = questions;
                            this.setState({
                                isViewUpdated: !this.state.isViewUpdated,
                            });
                        }
                    }
                });
        });
    };

    onEditQuestionBtnClicked = (question) => {
        this.editingQuestion = { ...question };
        this.setState({
            openEditModal: true,
        });
    };

    onCloseEditQuestionModal = () => {
        this.editingQuestion = {};
        this.setState({
            openEditModal: false,
        });
    };

    onShowResult = ({ type, msg }) => {
        this.setState({
            openSnack: true,
            snackMsg: msg,
            openEditModal: false,
            openRemoveFormModal: false,
            openRemoveQuestionModal: false,
            openEditFormTitleModal: false,
            alertType: type,
            openLoading: false,
        });
    };

    onUpdatedQuestionAccept = ({ id, title, meta }) => {
        this.setState({
            openEditModal: false,
            openLoading: true,
        });
        const { contract } = this.props.wallet;
        contract
            ?.update_question?.(
                {
                    id,
                    title,
                    meta,
                },
                // 300000000000000,
            )
            .then((question) => {
                if (question) {
                    const { qCounter } = this.state;
                    this.getAllQuestion(qCounter);
                    this.onShowResult({
                        type: 'success',
                        msg: 'Question has been updated',
                    });
                } else {
                    this.onShowResult({
                        type: 'error',
                        msg: 'Update question failure',
                    });
                }
            })
            .catch((err) => {
                this.onShowResult({
                    type: 'error',
                    msg: String(err),
                });
            });

        // this.getAllQuestion(this.state.qCounter);
    };

    onRemoveQuestionBtnClicked = (question) => {
        this.removingQuestion = { ...question };
        this.setState({
            openRemoveQuestionModal: true,
        });
    };

    onCloseRemoveQuestionModal = () => {
        this.removingQuestion = {};
        this.setState({
            openRemoveQuestionModal: false,
        });
    };

    onRemoveQuestionDeny = () => {
        this.onCloseRemoveQuestionModal();
    };

    onRemoveQuestionAccept = () => {
        this.setState({
            openRemoveQuestionModal: false,
            openLoading: true,
        });
        const { contract } = this.props.wallet;
        const { id } = this.removingQuestion;
        contract
            ?.delete_question(
                {
                    id,
                },
                // 300000000000000,
            )
            .then((ret) => {
                if (ret) {
                    if (ret) {
                        this.onShowResult({
                            type: 'success',
                            msg: 'Question has been deleted',
                        });
                        this.getFormDetail();
                    } else {
                        this.onShowResult({
                            type: 'error',
                            msg: 'Delete question failure',
                        });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                this.onShowResult({
                    type: 'error',
                    msg: String(err),
                });
            });
    };

    onAddNewQuestionBtnClicked = () => {
        Router.push(`/form/${this.formId}`);
    };

    onRemoveFormBtnClicked = () => {
        this.setState({ openRemoveFormModal: true });
    };

    onCloseRemoveFormModal = () => {
        this.setState({ openRemoveFormModal: false });
    };

    onCloseEditFormTitleModal = () => {
        this.setState({ openEditFormTitleModal: false });
    };

    onEditFormTitleBtnClicked = () => {
        this.setState({ openEditFormTitleModal: true });
    };

    onRemoveFormAccept = () => {
        this.setState({
            openRemoveFormModal: false,
            openLoading: true,
        });
        const { contract } = this.props.wallet;
        contract
            ?.delete_form(
                {
                    id: this.formId,
                },
                // 300000000000000,
            )
            .then((ret) => {
                if (ret) {
                    Router.push('/form-create');
                } else {
                    this.onShowResult({
                        type: 'error',
                        msg: 'Remove form failure',
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.onShowResult({
                    type: 'err',
                    msg: String(err),
                });
            });
    };

    onUpdatedFormAccept = ({ title }) => {
        if (title === '') {
            return this.onShowResult({
                type: 'err',
                msg: 'Title could not be empty',
            });
        }

        if (title === this.form.title) {
            return this.onShowResult({
                type: 'err',
                msg: 'Title could not be the same',
            });
        }

        this.setState({
            openEditFormTitleModal: false,
            openLoading: true,
        });

        const { contract } = this.props.wallet;
        contract
            ?.update_form(
                {
                    id: this.formId,
                    title,
                },
                // 300000000000000,
            )
            .then((ret) => {
                if (ret) {
                    this.onShowResult({
                        type: 'success',
                        msg: 'Form has been updated',
                    });
                    this.getFormDetail();
                } else {
                    this.onShowResult({
                        type: 'error',
                        msg: 'Update form failure',
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.onShowResult({
                    type: 'err',
                    msg: String(err),
                });
            });
    };

    onGetPublicLinkBtnClicked = () => {
        const uri = new URL(window.location.href);
        const { origin } = uri;
        const sharedLinked = `${origin}/form-answer?id=${this.formId}`;
        navigator.clipboard.writeText(sharedLinked);
        this.setState({
            openSnack: true,
            snackMsg: 'Copied',
        });
    };

    onCloseSnack = () => {
        this.setState({
            openSnack: false,
        });
    };

    onRenderStep = () => {
        const { step } = this.state;
        switch (step) {
            case 0:
                return 'Loading Form';
            case 1:
                return this.onRenderForm();
            default:
                break;
        }
    };

    onRenderForm = () => {
        const { title, qCounter } = this.state;
        return (
            <div className={styles.form_area}>
                <div className={styles.form_header_area}>
                    <div className={styles.form_header_heading}>Your Form Information</div>
                    <div className={styles.form_header_action}>
                        <button className={styles.form_header_action_btnL} onClick={this.onGetPublicLinkBtnClicked}>
                            Get Link
                        </button>
                        <button className={styles.form_header_action_btnR} onClick={this.onRemoveFormBtnClicked}>
                            Delete Form
                        </button>
                    </div>
                </div>
                <div className={styles.form_title_area}>
                    <div className={styles.form_title_label}>Title:</div>
                    <div className={styles.form_title_value}>{title}</div>
                    <div className={styles.form_title_edit}>
                        <button className={styles.form_header_action_btnL} onClick={this.onEditFormTitleBtnClicked}>
                            <Tooltip title={'Edit'}>
                                <EditOutlinedIcon />
                            </Tooltip>
                        </button>
                    </div>
                </div>
                <div className={styles.form_question_area}>
                    <div className={styles.form_question_label}>Question(s): </div>
                    <div className={styles.form_question_value}>{qCounter}</div>
                    <div className={styles.form_question_action}>
                        <button className={styles.form_header_action_btn} onClick={this.onAddNewQuestionBtnClicked}>
                            <AddOutlinedIcon /> Add New Question
                        </button>
                    </div>
                </div>
                <div className={styles.question_area}>
                    {this.questions?.map?.((question) => {
                        return this.onRenderQuestion(question);
                    })}
                </div>
            </div>
        );
    };

    onRenderQuestion = (question) => {
        const { id, type, title, meta } = question;
        return (
            <div key={id} className={styles.question_detail_area}>
                <div className={styles.question_detail_type}>
                    <div className={styles.question_detail_type_value}>{this.type?.[type]}</div>
                    <div className={styles.question_detail_type_action}>
                        <Tooltip title={'Edit'}>
                            <button className={styles.form_header_action_btnL} onClick={() => this.onEditQuestionBtnClicked(question)}>
                                <EditOutlinedIcon />
                            </button>
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <button className={styles.form_header_action_btnR} onClick={() => this.onRemoveQuestionBtnClicked(question)}>
                                <DeleteOutlinedIcon />
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <div className={styles.question_detail_title}>Title: {title}</div>
                <div>{this.onRenderQuestionTypeDetail({ type, meta })}</div>
            </div>
        );
    };

    onRenderQuestionTypeDetail = ({ type, meta }) => {
        const picks = meta?.split(';');
        switch (type) {
            case 0:
                picks = ['True', 'False'];
            case 1:
            case 2:
                break;
            case 3:
                picks = [];
                break;
            default:
                break;
        }
        return (
            <div>
                {picks?.map((pick, index) => {
                    return (
                        <div key={index} className={styles.question_block_input_item}>
                            <div className={styles.question_block_input_item_icon}>{this.alphabet[index]}</div>
                            <div className={styles.question_block_input_item_value}>{pick}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const box_style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: '24px',
        };
        const { openEditModal, openRemoveQuestionModal, openRemoveFormModal, openSnack, snackMsg, alertType, openLoading, openEditFormTitleModal } = this.state;
        return (
            <>
                <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={this.onCloseSnack} />
                <Modal
                    open={openEditModal}
                    onClose={this.onCloseEditQuestionModal}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'>
                    <Box sx={box_style}>
                        <EditQuestionModal {...this.editingQuestion} onAccept={this.onUpdatedQuestionAccept} />
                    </Box>
                </Modal>
                <Modal
                    open={openRemoveQuestionModal}
                    onClose={this.onCloseRemoveQuestionModal}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'>
                    <Box sx={box_style}>
                        <ConfirmationModel onDeny={this.onRemoveQuestionDeny} onAccept={this.onRemoveQuestionAccept} />
                    </Box>
                </Modal>
                <Modal
                    open={openRemoveFormModal}
                    onClose={this.onCloseRemoveFormModal}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'>
                    <Box sx={box_style}>
                        <ConfirmationModel onDeny={this.onCloseRemoveFormModal} onAccept={this.onRemoveFormAccept} />
                    </Box>
                </Modal>
                <Modal
                    open={openEditFormTitleModal}
                    onClose={this.onCloseEditFormTitleModal}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'>
                    <Box sx={box_style}>
                        <EditFormModal {...this.editingQuestion} onAccept={this.onUpdatedFormAccept} />
                    </Box>
                </Modal>
                <div className={styles.root}>{this.onRenderStep()}</div>
            </>
        );
    }
}

export default connect((state) => {
    return {
        wallet: state.wallet,
        form: state.form,
    };
})(withRouter(FormDetail));
