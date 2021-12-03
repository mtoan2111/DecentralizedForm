import React from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import Form from '../../components/form/form';
import styles from './formanalysis.module.css';

class FormAnalysis extends React.Component {
    raws = [];
    forms = [];
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
        };
    }

    componentDidMount() {
        this.onGetFormsCount();
    }

    onGetFormsCount = () => {
        const { contract, walletConnection } = this.props.wallet;
        const userId = walletConnection.getAccountId();
        contract
            ?.get_form_count?.({
                userId: userId,
            })
            .then((total) => {
                this.onGetForms({ total });
                this.setState({
                    total,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    onGetForms = ({ total }) => {
        try {
            const { contract, walletConnection } = this.props.wallet;
            const num_page = parseInt(total / 5) + 1;
            const page_arr = new Array(num_page).fill(0);
            this.forms = [];
            const userId = walletConnection.getAccountId();
            page_arr.map((page, index) => {
                contract
                    .get_forms({
                        userId,
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
                                let forms = [];
                                this.raws.map((raw) => {
                                    forms = [...forms, ...(raw?.data || [])];
                                });
                                this.forms = forms;
                                this.setState({
                                    isViewUpdated: !this.state.isViewUpdated,
                                });
                            }
                        }
                    });
            });
        } catch (err) {}
    };

    onShowFormDetail = ({ id }) => {
        Router.push(`form-analysis/${id}`);
    };

    render() {
        return (
            <div className={styles.root}>
                <div className={styles.your_form_title}>Your form(s): {this.state.total}</div>
                <div className={styles.your_form}>
                    {this.forms?.map?.((form) => {
                        const { id, owner, q_counter, title, q_participant } = form;
                        return (
                            <Form
                                key={id}
                                id={id}
                                owner={owner}
                                qCounter={q_counter}
                                qParticipant={q_participant}
                                title={title}
                                onViewMore={this.onShowFormDetail}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(withRouter(FormAnalysis));
