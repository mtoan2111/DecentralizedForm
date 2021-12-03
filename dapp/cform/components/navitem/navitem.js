import React from "react";
import styles from "./navitem.module.css";
import Router from "next/router";

export default class NavItem extends React.Component {
    constructor(props) {
        super(props);
    }

    onNavItemClicked = () => {
        const { href } = this.props;
        Router.push(href);
    };

    render() {
        const { icon, content, actived } = this.props;
        return (
            <div className={styles.root} onClick={this.onNavItemClicked}>
                <div className={actived ? styles.nav_icon_active : styles.nav_icon}>{icon}</div>
                <div className={actived ? styles.nav_content_active : styles.nav_content}>{content}</div>
            </div>
        );
    }
}
