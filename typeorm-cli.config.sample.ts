import { DataSource } from "typeorm";

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'enterpassword',
  database: 'enterdatabase',
  entities: ['**/*.entity.js'],
  migrations: ['migrations/*.js'],
})