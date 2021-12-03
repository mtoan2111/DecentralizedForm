import { style } from '@mui/system';
import React from 'react';
import styles from './question.module.css';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import { connect } from 'react-redux';

class OnceQuestion extends React.Component {
    alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    constructor(props) {
        super(props);
        this.state = {
            active: -1,
        };
    }

    onQuestionClicked = (index) => {
        this.setState({
            active: index,
        });
    };

    onRenderQuestionMeta = (value, index) => {
        const { active } = this.state;
        return (
            <div key={index} className={styles.question_meta_root} onClick={() => this.onQuestionClicked(index)}>
                <div className={active === index ? styles.question_meta_mark_active : styles.question_meta_mark}>{this.alphabet[index]}</div>
                <div className={styles.question_meta_value}>{value}</div>
            </div>
        );
    };

    // onSubmitAnswerBtnClicked = () => {
    //     const { formId, id, meta } = this.props;
    //     const { contract } = this.props.wallet;
    //     const { active } = this.state;
    //     const picks = meta?.split?.(';');

    //     contract
    //         .submit_answer({
    //             formId,
    //             questionId: id,
    //             answer: picks[active],
    //         })
    //         .then((ret) => {
    //             this.props.onNext?.();
    //         });
    // };

    onSubmitAnswerBtnClicked = () => {
        const { formId, id, meta } = this.props;
        const { contract } = this.props.wallet;
        const { active } = this.state;
        const picks = meta?.split?.(';');

        this.props?.onSubmitAnswer?.({
            formId,
            questionId: id,
            answer: picks[active],
        });
    };

    render() {
        const { title, meta } = this.props;
        const picks = meta?.split?.(';');
        return (
            <div className={styles.root}>
                <div className={styles.question_area}>
                    <div>Question:</div>
                    <div className={styles.question_title}>{title}</div>
                    <div>
                        {picks?.map?.((pick, index) => {
                            return this.onRenderQuestionMeta(pick, index);
                        })}
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
})(OnceQuestion);
