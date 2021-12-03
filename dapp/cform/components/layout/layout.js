import React from 'react';
import Head from 'next/head';
import Header from '../header/header';
import Footer from '../footer/footer';
import styles from './layout.module.css';

export default class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrolling: false,
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (window.scrollY === 0 && this.state.scrolling === true) {
            this.setState({ scrolling: false });
        } else if (window.scrollY !== 0 && this.state.scrolling !== true) {
            this.setState({ scrolling: true });
        }
    };

    render() {
        const { children } = this.props;
        return (
            <div className={styles.root}>
                <Head {...this.props}>
                    <title>Decentralize Form</title>
                    <link rel='preconnect' href='https://fonts.googleapis.com' />
                    <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin />
                    <link href='https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap' rel='stylesheet' />
                </Head>
                <div className={styles.header} style={this.state.scrolling ? { background: '#fff' } : null}>
                    <Header />
                </div>
                <div className={styles.body}>
                    <div className={styles.main}>{children}</div>
                    <div className={styles.footer}>
                        <Footer />
                    </div>
                </div>
            </div>
        );
    }
}
