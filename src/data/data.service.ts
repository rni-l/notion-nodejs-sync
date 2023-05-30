import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { Data } from './data.entity';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import { DataConfig } from './data-config.entity';

const page_size = 20;

const filterUndefined = (obj: Record<string, any>) => {
  return Object.entries(obj).reduce((acc: Record<string, any>, v) => {
    if (v[1] !== undefined) {
      acc[v[0]] = v[1];
    }
    return acc;
  }, {});
};

@Injectable()
export class DataService {
  notion: Client;
  constructor(private readonly configService: ConfigService) {
    this.notion = new Client({
      auth: this.configService.get('NOTION_SECRET'),
    });
  }

  getNotionData(date: string, start_cursor?: string) {
    try {
      return this.notion.databases.query({
        database_id: this.configService.get('NOTION_DATABASE_ID'),
        page_size: page_size,
        start_cursor: start_cursor,
        ...filterUndefined({
          filter: date
            ? {
                and: [
                  {
                    property: 'Created',
                    date: {
                      after: date,
                    },
                  },
                ],
              }
            : undefined,
          sorts: [
            {
              property: 'Created',
              direction: 'ascending',
            },
          ],
        }),
      });
    } catch (error) {}
  }

  getLatest() {
    return Data.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['createdAt'],
    });
  }

  async insertData(data: Record<string, any>) {
    if (!data.next_cursor) return;
    const target = await Data.findOne({
      where: { rowId: data.id },
      attributes: ['rowId'],
    });
    if (target) return true;
    const newData = new Data();
    newData.rowId = data.id;
    newData.row = data;
    newData.createdAt = data.created_time;
    return newData.save();
  }

  async getAndInsert(date: string, next_cursor?: string) {
    console.log('get notion data now...');
    console.log('next_cursor:', next_cursor);
    const data = await this.getNotionData(date, next_cursor);
    await this.insertDataConfig(data.next_cursor);
    console.log('get notion data:', data.results.length, data.next_cursor);
    if (!data) {
      console.log('End');
      return;
    }
    await Promise.all(data.results.map((v) => this.insertData(v)));
    if (data.has_more) return this.getAndInsert(date, data.next_cursor);
    return;
  }

  getConfig() {
    return DataConfig.findOne({
      order: [['createdAt', 'DESC']],
    });
  }

  insertDataConfig(startCursor: string) {
    const config = new DataConfig();
    config.startCursor = startCursor;
    return config.save();
  }

  async sync(isAll = false) {
    let date = undefined;
    let latestConfig: DataConfig;
    if (!isAll) {
      const latest = await this.getLatest();
      latestConfig = await this.getConfig();
      if (latest) {
        date = dayjs(latest.getDataValue('createdAt'))
          .subtract(1, 'day')
          .format('YYYY-MM-DD');
      }
    }
    console.log('start:', date);
    // 'db003f95-e500-4cc5-9f8f-cdf72cfa11ac'
    await this.getAndInsert(
      date,
      latestConfig?.getDataValue?.('startCursor') || undefined,
    );
    return 'ok';
  }

  syncAll() {
    return this.sync(true);
  }
  syncLatest() {
    return this.sync();
  }

  getAll() {
    return Data.findAll({ attributes: ['row'] }).then((res) => {
      return res.map((v) => v.getDataValue('row'));
    });
  }
}
