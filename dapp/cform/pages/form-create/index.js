import React from 'react';
import styles from './formcreate.module.css';
import TextInput from '../../components/textinput/textinput';
import Form from '../../components/form/form';
import { connect } from 'react-redux';
import Router from 'next/router';
import Notify from '../../components/notify';

class FormCreate extends React.Component {
    raws = [];
    forms = [];
    title = '';
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            openSnack: false,
            openLoading: false,
            snackMsg: '',
            alertType: 'success',
        };
    }

    componentDidMount() {
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
    }

    onCreateNewFormBtnClicked = () => {
        this.setState({
            openLoading: true,
        });
        const { contract } = this.props.wallet;
        contract
            ?.init_new_form?.(
                {
                    title: this.title,
                },
                300000000000000,
            )
            .then((id) => {
                Router.push(`form/${id}`);
            })
            .catch((err) => {
                console.log(err);
                this.onShowResult({
                    type: 'error',
                    msg: String(err),
                });
            });
    };

    onNewFormTitleChanged = (value) => {
        this.title = value;
    };

    onShowResult = ({ type, msg }) => {
        this.setState({
            openSnack: true,
            snackMsg: msg,
            alertType: type,
            openLoading: false,
        });
    };

    onShowEditForm = ({ id, qCounter }) => {
        Router.push(`form-detail/?id=${id}&c=${qCounter}`);
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
                    <div className={styles.new_form_title}>Create new form</div>
                    <div className={styles.new_form_area}>
                        <TextInput placeholder={'Type your form name here'} onChange={this.onNewFormTitleChanged} className={styles.create_form_input} />
                        <div className={styles.create_form_btn_area}>
                            <button className={styles.create_form_btn} onClick={this.onCreateNewFormBtnClicked}>
                                Create
                            </button>
                        </div>
                    </div>
                    <div className={styles.your_form_title}>Your form(s): {this.state.total}</div>
                    <div className={styles.your_form}>
                        {this.forms?.map?.((form) => {
                            const { id, owner, q_counter, title } = form;
                            return <Form key={id} id={id} owner={owner} qCounter={q_counter} title={title} onViewMore={this.onShowEditForm} />;
                        })}
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
})(FormCreate);
