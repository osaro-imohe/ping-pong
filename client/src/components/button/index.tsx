import cx from 'clsx';
import Text from '../text';
import styles from '../../styles.module.css';
import { ButtonProps } from '../../types/components';

const computeButtonTextColor = (buttonVariant: ButtonProps['variant']) => {
  switch (buttonVariant) {
    case 'gray':
      return 'primary';
    case 'primary':
    case 'tertiary':
    case 'secondary':
      return 'secondary';
    default:
      return 'primary';
  }
};

const Button = ({
  onClick,
  children,
  text = null,
  size = 'md',
  curbed = true,
  type = 'button',
  rounded = false,
  disabled = false,
  variant = 'primary',
}: ButtonProps) => (
  // eslint-disable-next-line react/button-has-type
  <button
    // eslint-disable-next-line react/button-has-type
    type={type}
    disabled={disabled}
    onClick={() => { if (onClick) { onClick(); } }}
    className={cx(
      styles.border_none,
      styles.color_white,
      styles.button_height,
      {
        [styles.border_radius_curbed]: curbed,
        [styles.border_radius_rounded]: rounded,
        [styles.button_width_xs]: size === 'xs',
        [styles.button_width_sm]: size === 'sm',
        [styles.button_width_md]: size === 'md',
        [styles.button_width_lg]: size === 'lg',
        [styles.background_color_light_gray]: disabled,
        [styles.background_color_gray]: variant === 'gray',
        [styles.background_color_black]: variant === 'primary',
        [styles.background_color_white]: variant === 'secondary',
        [styles.background_color_blue]: variant === 'tertiary',
      },
    )}
  >
    {children}
    {(!children && text) ? <Text text={text} bold variant={computeButtonTextColor(variant)} size="xs" /> : null}
  </button>
);

export default Button;
