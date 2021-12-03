import React from 'react';
import styles from './footer.module.css';
import Image from 'next/image';
import Logo from './logo.svg';
import Link from 'next/link';

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.root}>
                <div className={styles.license}>
                    <div className={styles.logo}>
                        <Image src={Logo} layout='fill' alt={'Error'} priority={true} />
                    </div>
                    <div className={styles.term}>
                        <div>© 2021 NEAR Inc. All Rights Reserved.</div>
                        <div>
                            <Link href='https://wallet.near.org/terms'>
                                <a className={styles.term_link}>Terms of Service</a>
                            </Link>
                            &nbsp; | &nbsp;
                            <Link href='https://near.org/privacy/'>
                                <a className={styles.term_link}>Privacy Policy</a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles.detail}>
                    NEAR is a scalable computing and storage platform that changes how the web works for the better. &nbsp;
                    <Link href='https://near.org/'>
                        <a target='_blank' className={styles.term_link_color_secondary}>
                            Learn More
                        </a>
                    </Link>
                </div>
                <div className={styles.qa}>
                    <div className={styles.qa_quest}>Questions?</div>
                    <div className={styles.qa_comm}>
                        <Link href='https://near.chat/'>
                            <a target='_blank' className={styles.qa_comm_link}>
                                Join Community
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
