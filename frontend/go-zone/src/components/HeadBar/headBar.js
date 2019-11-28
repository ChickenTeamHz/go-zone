import React from 'react'
import { connect } from 'dva'
import styles from './headBar.css'

function HeadBar() {
    return (
        <div className={ styles.head_bar }>

        </div>
    );
}

HeadBar.propTypes = {
};

export default connect()(HeadBar);