import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { formatDate } from 'src/common';

@Table({
  tableName: 'data',
  underscored: true,
})
export class Data extends Model<Data> {
  @Column({
    type: DataType.JSON,
    comment: 'row',
    allowNull: true,
  })
  row: any;

  @Column({
    type: DataType.STRING(64),
    comment: 'row id',
    allowNull: true,
  })
  rowId: any[];

  @Column({
    get() {
      return formatDate(this.getDataValue('createdAt'));
    },
  })
  createdAt: Date;
}
