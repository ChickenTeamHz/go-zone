import React from 'react'
import { connect } from 'dva'
import styles from './index.css'

function HeadBar() {
    return (
        <div className={ styles.head_bar }>
            <div className={ styles.page_name }>Go-Zone</div>
        </div>
    );
}

HeadBar.propTypes = {
};

export default connect()(HeadBar);