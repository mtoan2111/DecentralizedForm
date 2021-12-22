import React from 'react';
import styles from './participant.module.css';
import TextInput from '../../components/textinput/textinput';
import Form from '../../components/form/form';
import { connect } from 'react-redux';
import Router from 'next/router';

class FormCreate extends React.Component {
    raws = [];
    forms = [];
    title = '';
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
        };
    }

    componentDidMount() {
        const { contract } = this.props.wallet;
        contract
            ?.get_form_count?.(
                {},
                50000000000000
            )
            .then((total) => {
                this.onGetTotalForm({ total });
                this.setState({
                    total,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    onCreateNewFormBtnClicked = () => {
        const { contract } = this.props.wallet;
        contract
            ?.init_new_form?.(
                {
                    title: this.title,
                },
                50000000000000,
            )
            .then((id) => {
                Router.push(`form/${id}`);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    onNewFormTitleChanged = (value) => {
        this.title = value;
    };

    onGetTotalForm = ({ total }) => {
        try {
            const { contract } = this.props.wallet;
            const num_page = parseInt(total / 10) + 1;
            const page_arr = new Array(num_page).fill(0);
            this.forms = [];
            page_arr.map((page, index) => {
                contract
                    .get_forms(
                        {
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
                                this.raws.map((raw) => {
                                    this.forms = [...this.forms, ...(raw?.data || [])];
                                });
                                this.setState({
                                    isViewUpdated: !this.state.isViewUpdated,
                                });
                            }
                        }
                    });
            });
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        return (
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
                <div className={styles.your_form_title}>Your form</div>
                <div className={styles.your_form}>
                    {this.forms?.map?.((form) => {
                        const { id, owner, q_counter, title } = form;
                        return <Form key={id} id={id} owner={owner} qCounter={q_counter} title={title} />;
                    })}
                </div>
                <div></div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(FormCreate);
