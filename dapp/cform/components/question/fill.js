import React from 'react';
import styles from './question.module.css';
import { connect } from 'react-redux';

class FillQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ans: '',
        };
    }

    componentDidMount() {
        const { title } = this.props;
        this.setState({
            isUpdatedView: !this.state.isUpdatedView,
        });
    }

    onSubmitAnswerBtnClicked = () => {
        const { formId, id } = this.props;
        const { ans } = this.state;

        this.props?.onSubmitAnswer?.({
            formId,
            questionId: id,
            answer: ans,
        });
    };

    onAnswerChanged = (e) => {
        this.setState({
            ans: e.target.value,
        });
    };

    render() {
        const { title } = this.props;
        const { ans } = this.state;
        return (
            <div className={styles.root}>
                <div className={styles.question_area}>
                    <div>Question:</div>
                    <div className={styles.question_title}>{title}</div>
                    <div>
                        <div className={styles.question_meta_root}>
                            <textarea
                                className={styles.question_meta_input}
                                value={ans}
                                onChange={this.onAnswerChanged}
                                placeholder={'Type your answer here'}
                            />
                        </div>
                    </div>
                    <div className={styles.submit_button_area}>
                        <button className={styles.submit_button} onClick={this.onSubmitAnswerBtnClicked}>
                            Next
                        </button>
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
})(FillQuestion);
