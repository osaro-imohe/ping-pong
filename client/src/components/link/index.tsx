import cx from 'clsx';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles.module.css';
import { LinkProps } from '../../types/components';

const LinkTo = ({
  type = 'internal', path, children,
}: LinkProps): ReactElement => (
  type === 'internal' ? <Link to={path}>{children}</Link> : <a href={path} className={cx(styles.min_width, styles.min_height)}>{children}</a>
);

export default LinkTo;
