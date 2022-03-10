import cx from 'clsx';
import styles from '../../styles.module.css';
import { ContainerProps } from '../../types/components';

const Container = ({
  type = 'div',
  top,
  bottom,
  left,
  right,
  position,
  height = 'max-content',
  width = 'max-content',
  padding,
  paddingTop,
  paddingLeft,
  paddingRight,
  paddingBottom,
  marginTop,
  marginRight,
  marginLeft,
  marginBottom,
  marginAuto = false,
  fullHeight = false,
  fullWidth = false,
  backgroundColor,
  justifyContent,
  flexGrow,
  flexBasis,
  flexShrink,
  flexWrap,
  flex,
  overflow,
  borderRadius,
  inline = false,
  block = false,
  alignItems,
  textAlign,
  border,
  flexDirection,
  children,
}: ContainerProps) => {
  const Tag = type;
  return (
    <Tag
      className={cx({
        [styles.full_width]: fullWidth,
        [styles.full_height]: fullHeight,
        [styles.inline]: inline,
        [styles.block]: block,
        [styles.margin_auto]: marginAuto,
        [styles.flexDirectionRow]: flexDirection === 'row',
        [styles.flexDirectionColumn]: flexDirection === 'column',
      })}
      style={{
        left,
        right,
        bottom,
        top,
        width,
        height,
        padding,
        paddingTop,
        paddingLeft,
        paddingRight,
        paddingBottom,
        marginTop,
        marginRight,
        marginLeft,
        marginBottom,
        position,
        backgroundColor,
        justifyContent,
        flexGrow,
        flexBasis,
        flexShrink,
        flexWrap,
        flex,
        overflow,
        borderRadius,
        alignItems,
        textAlign,
        border,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Tag>
  );
};

export default Container;
