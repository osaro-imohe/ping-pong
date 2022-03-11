import { LoaderProps } from '../../types/components';
import styles from '../../styles.module.css';

const Loader = ({ width, height, center } : LoaderProps) => (
  <div
    className={styles.lds_ring}
    style={center ? {
      width: `${width}px`, height: `${height}px`, left: '0', right: '0', margin: 'auto', top: '0', bottom: '0',
    } : { width: `${width}px`, height: `${height}px` }}
  >
    <div style={{
      margin: `${width / 10}px`, width: `${width * 0.80}px`, height: `${height * 0.80}px`, border: `${width / 10}px solid white`,
    }}
    />
    <div style={{
      margin: `${width / 10}px`, width: `${width * 0.80}px`, height: `${height * 0.80}px`, border: `${width / 10}px solid white`,
    }}
    />
    <div
      style={{
        margin: `${width / 10}px`, width: `${width * 0.80}px`, height: `${height * 0.80}px`, border: `${width / 10}px solid white`,
      }}
    />
    <div style={{
      margin: `${width / 10}px`, width: `${width * 0.80}px`, height: `${height * 0.80}px`, border: `${width / 10}px solid white`,
    }}
    />
  </div>
);

export default Loader;
