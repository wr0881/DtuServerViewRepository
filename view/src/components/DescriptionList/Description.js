import React from 'react';
import PropTypes from 'C:/Users/11435/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/prop-types';
import classNames from 'C:/Users/11435/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/classnames';
import { Col } from 'antd';
import responsive from 'components/DescriptionList/responsive';
import styles from './index.less';

const Description = ({ term, column, className, children, ...restProps }) => {
  const clsString = classNames(styles.description, className);
  return (
    <Col className={clsString} {...responsive[column]} {...restProps}>
      {term && <div className={styles.term}>{term}</div>}
      {children !== null &&
        children !== undefined && <div className={styles.detail}>{children}</div>}
    </Col>
  );
};

Description.defaultProps = {
  term: '',
};

Description.propTypes = {
  term: PropTypes.node,
};

export default Description;
