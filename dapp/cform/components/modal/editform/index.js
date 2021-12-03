import React from 'react';
import styles from './editform.module.css';
import { connect } from 'react-redux';

class EditQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
        };
    }

    componentDidMount() {}

    onFormTitleChanged = (e) => {
        this.setState({
            title: e.target.value,
        });
    };

    onUpdateFormBtnClicked = () => {
        const { title } = this.state;
        this.props?.onAccept?.({ title });
    };

    render() {
        const { title } = this.state;
        return (
            <div className={styles.root}>
                <div className={styles.question_area}>
                    <h2>Edit Your Form</h2>
                    <div className={styles.question_block}>
                        <input className={styles.question_text_input} value={title} placeholder={'Type a new title here'} onChange={this.onFormTitleChanged} />
                        <div className={styles.question_block_btn_area}>
                            <button className={styles.question_block_btn_new} onClick={this.onUpdateFormBtnClicked}>
                                Update Form
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(EditQuestion);
