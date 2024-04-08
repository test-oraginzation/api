import { config } from 'dotenv';
import * as process from 'process';

config();

export default {
  isGlobal: true,
  endPoint: process.env.MINIO_END_POINT || 'localhost',
  port: Number(process.env.MINIO_PORT || '9000'),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
};
