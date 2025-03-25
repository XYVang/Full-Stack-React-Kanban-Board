import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const dbHost = process.env.DB_HOST || 'localhost';
console.log('DB_HOST:', dbHost);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('Parsed DB_PORT:', dbPort);
const sequelize = process.env.DB_URL
    ? new Sequelize(process.env.DB_URL)
    : new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD, {
        host: dbHost,
        port: dbPort,
        dialect: 'postgres',
        dialectOptions: {
            decimalNumbers: true,
        },
    });
// Models and relationships
const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);
User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
export { sequelize, User, Ticket };
