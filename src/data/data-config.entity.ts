import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
} from 'sequelize-typescript';
import { formatDate } from 'src/common';

@Table({
  tableName: 'data_config',
  underscored: true,
})
export class DataConfig extends Model<DataConfig> {
  @Column({
    type: DataType.STRING(64),
    comment: 'startCursor',
  })
  startCursor: string;

  @CreatedAt
  createdAt: Date;
}
