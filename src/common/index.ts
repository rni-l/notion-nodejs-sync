import * as dayjs from 'dayjs';

export const FORMAT_DATE_TYPE = 'YYYY-MM-DD HH:mm:ss';
export function formatDate(val: any) {
  return val ? dayjs(val).format(FORMAT_DATE_TYPE) : '';
}
