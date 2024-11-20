import { winstonLogger } from '@Fallda1/jobber-shared';
import { Logger } from 'winston';
import { config } from '@auth/config';
import { Sequelize } from 'sequelize';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');

export const sequelize: Sequelize = new Sequelize('jobber_auth', 'jobber', 'api', {
  host: 'localhost',
  port: 3306, // Host port 3307, as mapped in Docker Compose
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    multipleStatements: true
  }
});
// export const sequelize: Sequelize = new Sequelize(process.env.MYSQL_DB!, {
//   dialect: 'mysql',
//   logging: false,
//   dialectOptions: {
//     multipleStatements: true
//   }
// });
export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    log.info('AuthService Mysql database connection has been established successfully.');
  } catch (error) {
    log.error('Auth Service - Unable to connect to database.');
    log.log('error', 'AuthService databaseConnection() method error:', error);
  }
}
