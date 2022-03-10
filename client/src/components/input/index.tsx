import cx from 'clsx';
import Text from '../text';
import Container from '../container';
import styles from '../../styles.module.css';
import { InputProps } from '../../types/components';

const Input = ({
  size,
  placeHolder,
  label = false,
  type = 'input',
  password = false,
  labelText = '',
  onChangeText = () => null,
} : InputProps) => {
  const Tag = type;

  const inputWidthDict = {
    xs: 54,
    sm: 167,
    md: 254,
    lg: 400,
  };

  const inputWidth = inputWidthDict[size];
  return (
    <Container marginBottom="22px">
      {label && (
        <Container marginBottom="8px">
          <Text variant="secondary" bold size="xs" text={labelText} />
        </Container>
      )}
      <Tag
        type={password ? 'password' : type}
        className={cx(styles.input)}
        placeholder={placeHolder}
        onChange={(e: any) => {
          if (onChangeText) {
            onChangeText(e.target.value);
          }
        }}
        style={{
          width: inputWidth,
          fontWeight: '400',
          textIndent: '20px',
          borderRadius: '16px',
          borderColor: '#F3F3F3',
          backgroundColor: '#F3F3F3',
          height: type === 'input' ? '50px' : '300px',
          padding: type === 'input' ? '0px 8px' : '8px 8px',
        }}
      />
    </Container>
  );
};

export { Input };
