import { winstonLogger } from '@Fallda1/jobber-shared';
import { config } from '@auth/config';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'AuthQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
    try {
        const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`)
        const channel: Channel = await connection.createChannel();
        log.info('Auth server connected to queue successfully...');
        closeConnection(channel, connection);
        return channel;
    } catch (error) {
        log.log('error', 'AuthService CreateConnection() method:', error);
        return undefined
    }
}

function closeConnection(channel: Channel, connection: Connection): void {
    process.once('SIGINT', async () => {
        await channel.close();
        await connection.close();
    });
}
export { createConnection };