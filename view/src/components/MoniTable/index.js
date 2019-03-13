import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

export default class MyTable extends PureComponent {
  render() {
    const { columns, dataSource, loading, pagination, onChange } = this.props;

    return (
      <div className={styles.standardTable}>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: '1700px' }}
          pagination={pagination}
          onChange={onChange}
        />
      </div>
    );
  }
}
