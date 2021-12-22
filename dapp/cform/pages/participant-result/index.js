import { withRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import styles from './participantresult.module.css';
import Skeleton from '@mui/material/Skeleton';

class ParticipantResult extends React.Component {
    type = ['Yes/No question', 'Choose one answer', 'Choose multi answer', 'Fill to the blank space'];
    form = {};
    userId = '';
    answers = [];
    raws = [];
    skeletons = [];
    qCounter = 0;
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.getForm();
    }

    getForm = () => {
        const { query } = this.props.router;
        const { contract, walletConnection } = this.props.wallet;
        const { id, u } = query;
        this.userId = u;
        contract
            .get_form({
                id,
            })
            .then((form) => {
                if (form) {
                    this.form = form;
                    if (form.q_counter > 0) {
                        this.skeletons = new Array(form.q_counter).fill(0);
                    }
                    this.getAnswers(form.q_counter);
                    this.setState({
                        isViewUpdated: !this.state.isViewUpdated,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    getAnswers = (total) => {
        const { contract, walletConnection } = this.props.wallet;
        const { query } = this.props.router;
        const { id, u } = query;
        const num_page = total % 5 === 0 ? parseInt(total / 5) : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        this.answers = [];
        this.raws = [];
        page_arr.map((page, index) => {
            contract
                .get_answer_statistical(
                    {
                        userId: u,
                        formId: id,
                        page: index + 1,
                    },
                    50000000000000,
                )
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
                            let answers = [];
                            this.raws.map((raw) => {
                                answers = [...answers, ...(raw?.data || [])];
                            });
                            this.answers = answers;
                            this.setState({
                                isViewUpdated: !this.state.isViewUpdated,
                            });
                        }
                    }
                })
                .catch((err) => {});
        });
    };

    onRenderAnswer = (ans, index) => {
        const { type, title, answer } = ans;
        let anw_tranform = answer;
        if (answer === '' || answer === null) {
            anw_tranform = 'Does not have any answers';
        }
        let meta = anw_tranform.split('*');
        return (
            <div className={styles.answer_area} key={`ans_${index}`}>
                <div className={styles.answer_type}>Question Type: {this.type[type]}</div>
                <div>
                    <span className={styles.answer_title}>Quesion:</span> {title}
                </div>
                <div className={styles.answer_title}>
                    Answer:{' '}
                    {meta?.map((me, index) => {
                        return (
                            <span className={styles.answer} key={index}>
                                {me}
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    };

    onRenderSkeletons = () => {
        return this.skeletons?.map?.((skl, index) => {
            return (
                <div className={styles.answer_skeleton} key={index}>
                    <Skeleton height={140} variant='rectangular' key={index} className={styles.answer_skeleton_item} animation='wave' />
                </div>
            );
        });
    };

    onRenderAnswers = () => {
        return (
            <>
                {this.answers?.map?.((answer, index) => {
                    return this.onRenderAnswer(answer, index);
                })}
            </>
        );
    };

    render() {
        const { title } = this.form;
        return (
            <div className={styles.root}>
                <div className={styles.form_title}>{title}</div>
                <div className={styles.form_answer}>
                    The answer of <span className={styles.answer_userId}>{this.userId}</span> as follow:
                </div>
                {this.answers?.length === 0 ? this.onRenderSkeletons() : this.onRenderAnswers()}
                {/* {this.onRenderSkeletons()}
                {this.answers?.map?.((answer, index) => {
                    return this.onRenderAnswer(answer, index);
                })} */}
            </div>
        );
    }
}

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(withRouter(ParticipantResult));
