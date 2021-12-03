import React from 'react';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

class FormDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            valid: false,
        };
    }

    componentDidMount() {
        try {
            const { query } = this.props.router;
            const { contract, walletConnection } = this.props.wallet;
            const userId = walletConnection.getAccountId();
            contract
                ?.get_form?.({
                    userId,
                    id: query.id,
                })
                .then((form) => {
                    if (form) {
                        Router.push(`question?form_id=${form?.id}`);
                        this.onLoadingCompleted(true);
                    } else {
                        this.onLoadingCompleted(false);
                    }
                })
                .catch((err) => {
                    this.onLoadingCompleted(false);
                });
        } catch (err) {
            console.log(err);
            this.onLoadingCompleted(false);
        }
    }

    onLoadingCompleted = (result) => {
        this.setState({
            loading: false,
            valid: result,
        });
    };

    render() {
        return <div style={{ marginTop: 40 }}>{this.state.loading ? 'Validating...' : `${this.state.valid}`}</div>;
    }
}

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(withRouter(FormDetail));
