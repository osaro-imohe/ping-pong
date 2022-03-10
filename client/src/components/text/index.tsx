import cx from 'clsx';
import { ReactElement } from 'react';
import styles from '../../styles.module.css';
import { TextProps } from '../../types/components';

const Text = ({
  text,
  type = 'p',
  size = 'md',
  bold = false,
  light = false,
  variant = 'primary',
}: TextProps): ReactElement => {
  const Tag = type;
  return (
    <Tag
      className={cx(styles.margin_none, {
        [styles.text_xs]: size === 'xs',
        [styles.text_sm]: size === 'sm',
        [styles.text_md]: size === 'md',
        [styles.text_lg]: size === 'lg',
        [styles.text_bold]: bold === true,
        [styles.text_light]: light === true,
        [styles.color_gray]: variant === 'tertiary',
        [styles.color_black]: variant === 'primary',
        [styles.color_white]: variant === 'secondary',
        [styles.color_gray]: variant === 'auxilary',
      })}
    >
      {text}
    </Tag>
  );
};

export default Text;
