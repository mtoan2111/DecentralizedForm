import React from 'react';
import styles from './editquestion.module.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { connect } from 'react-redux';

class EditQuestion extends React.Component {
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
    alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];
    qTypeId = -1;
    title = '';
    onceAnswer = [];
    updated = false;

    constructor(props) {
        super(props);
        this.state = {
            aValue: this.questionType[0],
        };
    }

    componentDidMount() {
        if (this.props) {
            const { type, title, meta } = this.props;
            this.qTypeId = type;
            this.onceAnswer = meta?.split?.(';')?.map((ans) => {
                return { value: ans };
            });
            this.setState({
                title,
                aValue: this.questionType[type],
                isViewUpdated: !this.state.isViewUpdated,
            });
        }
    }

    onQuestionTitleChanged = (e) => {
        this.setState({
            title: e.target.value,
        });
    };

    onUpdateQuestion = () => {
        const { contract } = this.props.wallet;
        const { id } = this.props;
        const { title } = this.state;
        let meta = '';
        if (this.onceAnswer.length > 0) {
            let metas = [];
            this.onceAnswer?.map((answer) => {
                metas.push(answer.value);
            });
            meta = metas.join(';');
        }

        this.props?.onAccept?.({ id, title, meta });
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

    onQuestionTypeChange = (e, value) => {
        this.setState({
            aValue: value,
        });
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
                            value={this.state.title}
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
                            value={this.state.title}
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
                            value={this.state.title}
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
        const { type } = this.props;
        return (
            <div className={styles.root}>
                <div className={styles.question_area}>
                    <h2>Edit Your Question</h2>
                    <div className={styles.question_block}>
                        <div className={styles.question_block_title}>Question Type</div>
                        <div className={styles.question_block_input}>
                            <Autocomplete
                                className={styles.question_type_cbx}
                                disablePortal
                                value={this.state.aValue}
                                disabled={true}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                id='combo-box-demo'
                                options={this.questionType}
                                getOptionLabel={(option) => option.title || ''}
                                sx={{ width: 300 }}
                                onChange={this.onQuestionTypeChange}
                                renderInput={(params) => <TextField {...params} className={styles.question_type_cbx} />}
                            />
                        </div>
                        {this.onRenderQuestionType()}
                        <div className={styles.question_block_btn_area}>
                            {/* <button className={styles.question_block_btn_finish}>Finish</button> */}
                            <button className={styles.question_block_btn_new} onClick={this.onUpdateQuestion}>
                                Update Question
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
