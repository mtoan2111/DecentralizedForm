import { style } from '@mui/system';
import React from 'react';
import styles from './question.module.css';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import { connect } from 'react-redux';

class OnceQuestion extends React.Component {
    alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    anws = [];
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { title, meta } = this.props;
        meta?.split?.(';')?.map?.((pick) => {
            this.anws.push({
                active: false,
                value: pick,
            });
        });
        this.setState({
            isUpdatedView: !this.state.isUpdatedView,
        });
    }

    onQuestionClicked = (ans) => {
        ans.active = !ans.active;
        this.setState({
            isUpdatedView: !this.state.isUpdatedView,
        });
    };

    onRenderQuestionMeta = (ans, index) => {
        return (
            <div key={index} className={styles.question_meta_root} onClick={() => this.onQuestionClicked(ans)}>
                <div className={ans.active ? styles.question_multi_mark_active : styles.question_multi_mask}>{this.alphabet[index]}</div>
                <div className={styles.question_meta_value}>{ans.value}</div>
            </div>
        );
    };

    onSubmitAnswerBtnClicked = () => {
        const { formId, id } = this.props;
        const ans = this.anws.filter((x) => x.active)?.map((a) => a.value);
        const meta = ans.join('*');

        this.props?.onSubmitAnswer?.({
            formId,
            questionId: id,
            answer: meta,
        });
    };

    render() {
        const { title } = this.props;
        return (
            <div className={styles.root}>
                <div className={styles.question_area}>
                    <div>Question:</div>
                    <div className={styles.question_title}>{title}</div>
                    <div>
                        {this.anws?.map?.((ans, index) => {
                            return this.onRenderQuestionMeta(ans, index);
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
