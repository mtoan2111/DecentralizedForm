import React from "react";
import styles from "./textinput.module.css";

export default class TextInput extends React.Component {
    onValueChange = (e) => {
        this.props?.onChange?.(e.target.value);
    };

    render() {
        const { placeholder } = this.props;
        return (
            <div className={styles.root}>
                <input className={styles.input} onChange={this.onValueChange} placeholder={placeholder} />
            </div>
        );
    }
}
