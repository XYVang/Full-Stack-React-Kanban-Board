import { seedUsers } from './user-seeds';
import { seedTickets } from './ticket-seeds';
import { sequelize } from '../models/index';

const seedAll = async (): Promise<void> => {
  try {
    console.log("Starting database sync...");
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');
    
    console.log("Seeding users...");
    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');
    
    console.log("Seeding tickets...");
    await seedTickets();
    console.log('\n----- TICKETS SEEDED -----\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedAll();