import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

//delete drizzle folder before generate and migrate!

const DATABASE_URL = `postgres://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT || 5432}/${process.env.DATABASE}`;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const migrationClient = postgres(DATABASE_URL, { max: 1 });
const db: PostgresJsDatabase = drizzle(migrationClient);

const main = async () => {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  await migrationClient.end();
  console.log("Database migrated successfully!");
};

main();
