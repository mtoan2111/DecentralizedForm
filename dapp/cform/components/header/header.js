import React from 'react';
import styles from './header.module.css';
import Image from 'next/image';
import Logo from './lnc.svg';
import Account from '../account/account';
import NavItem from '../navitem/navitem';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswerOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    getActiveClassName = () => {
        const { router } = this.props;
        return router.pathname;
    };

    render() {
        const cPath = this.getActiveClassName();
        return (
            <div className={styles.root}>
                <div className={styles.logo}>
                    <Image src={Logo} layout='fill' alt={'Error'} priority={true} />
                </div>
                <div className={styles.nav}>
                    <div className={styles.nav_item}>
                        <NavItem icon={<QuestionAnswerIcon className={styles.nav_icon} />} content={'Join a form'} href={'/'} actived={cPath === '/'} />
                    </div>
                    <div className={styles.nav_item}>
                        <NavItem
                            icon={<NoteAddOutlinedIcon className={styles.nav_icon} />}
                            content={'New form'}
                            href={'/form-create'}
                            actived={cPath === '/form-create'}
                        />
                    </div>
                    <div className={styles.nav_item}>
                        <NavItem
                            icon={<BarChartOutlinedIcon className={styles.nav_icon} />}
                            content={'Form analysis'}
                            href={'/form-analysis'}
                            actived={cPath === '/form-analysis'}
                        />
                    </div>
                </div>
                <div className={styles.account}>
                    <Account />
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(withRouter(Header));

// export default withRouter(Header);
