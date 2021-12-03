import React from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import styles from "./search.module.css";

export default class SearchInput extends React.Component {
    searchValue = "";
    constructor(props) {
        super(props);
    }

    onSearchContentChange = (e) => {
        const { value } = e.target;
        this.searchValue = value;
    };

    onSearchButtonClicked = () => {
        this.props?.onSearch?.({ id: this.searchValue });
    };

    render() {
        return (
            <div className={styles.root}>
                <div className={styles.search_input_area}>
                    <input className={styles.search_input} placeholder={"Type your form ID here"} onChange={this.onSearchContentChange} />
                </div>
                <button className={styles.search_button_area} onClick={this.onSearchButtonClicked}>
                    <div className={styles.search_icon_area}>
                        <SearchIcon />
                    </div>
                    Search
                </button>
            </div>
        );
    }
}
