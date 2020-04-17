import { Link } from 'umi';
import styles from './style.less';

export default function ({style}) {
  return (
    <div className={styles.logo}>
      <Link to="/"><span style={style}>Go Zone</span></Link>
    </div>
  )
}
