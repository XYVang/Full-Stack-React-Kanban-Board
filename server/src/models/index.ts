import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';

// If DB_URL exists, use it; otherwise, use individual environment variables
const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)  // If the full URL is provided
  : new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,  // Use the DB_HOST environment variable
      port: process.env.DB_PORT || 5432,  // Default port if not set (PostgreSQL default is 5432)
      dialect: 'postgres',
      dialectOptions: {
        decimalNumbers: true,
      },
    });

// Define models and relationships
const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);

User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

export { sequelize, User, Ticket };
