import React from 'react';
import styles from './form.module.css';
import Router from 'next/router';
import { onUpdateForm } from '../../redux/action/form';
import { connect } from 'react-redux';

class Form extends React.Component {
    onViewFormDetail = () => {
        const { id, title, qCounter } = this.props;
        this.props.onUpdateForm?.({
            id,
            title,
            qCounter,
        });
        this.props?.onViewMore?.({ id, title, qCounter });
    };

    render() {
        const { title, qCounter, qParticipant } = this.props;
        return (
            <div className={styles.root}>
                <div className={styles.form_detail_area}>
                    <span className={styles.title}>{title}</span>
                    <div className={styles.qCounter}>Total questions: {qCounter}</div>
                    {typeof qParticipant !== 'undefined' && <div className={styles.qCounter}>Total participants: {qParticipant}</div>}
                </div>
                <div className={styles.view_more} onClick={this.onViewFormDetail}>
                    View more
                </div>
            </div>
        );
    }
}

export default connect(null, {
    onUpdateForm,
})(Form);
