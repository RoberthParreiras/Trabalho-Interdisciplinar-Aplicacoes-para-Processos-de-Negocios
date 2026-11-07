import { PrismaClient } from '../../generated/prisma/index.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

// converte a conexão de mysql para mariadb por conta do adaptador
const connectionString = process.env.DATABASE_URL.replace(/^mysql:\/\//, 'mariadb://');

const pool = mariadb.createPool(connectionString);

const adapter = new PrismaMariaDb(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;