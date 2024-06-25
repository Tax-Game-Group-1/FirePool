import { defineConfig } from "drizzle-kit";
import 'dotenv' 

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite"
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    database: process.env.DATABASE, 
    host: process.env.HOST, 
    resourceArn: process.env.RESOURCE_ARN, 
    secretArn: process.env.SECRET_ARN, 
    password: process.env.PASSWORD,
    port: parseInt(process.env.PORT),
    user: process.env.USER
  }
});
