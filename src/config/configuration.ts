import path = require('path');
import { config } from 'dotenv';

export enum EnvironmentTypes {
  Production = 'production',
  Development = 'development',
  Staging = 'staging',
  Test = 'test',
  Local = 'local',
}

const ENV_FILE = `${process.env.ENV || ''}.env`;
const ENV_PATH = path.resolve(process.cwd(), ENV_FILE);

config({ path: ENV_PATH });
export const configuration = {
  server: {
    host: process.env.API_ADDRESS || 'localhost',
    port: parseInt(process.env.API_PORT, 10) || 8000,
    environment: process.env.ENV || EnvironmentTypes.Development,
  },
  mongo: {
    url: process.env.MONGODB || 'mongodb://localhost:27017/example-project',
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'localhost-secret1',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'localhost-secret2',
  },
};
