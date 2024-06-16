import { drizzle } from 'drizzle-orm/aws-data-api/pg';
import { RDSDataClient } from '@aws-sdk/client-rds-data';
import { fromIni } from '@aws-sdk/credential-providers';
import dotenv from 'dotenv'
dotenv.config();

//NB: to create a profile on your local machine
//create file: Users/<username>./aws/credentials
//go to aws console > click on name in top right > security credentials
//create access key

const rdsClient = new RDSDataClient({
    credentials: fromIni({ profile: process.env['PROFILE'] }),
    region: 'us-east-1',
});

const db = drizzle(rdsClient, {
    database: process.env['DATABASE']!,
    secretArn: process.env['SECRET_ARN']!,
    resourceArn: process.env['RESOURCE_ARN']!,
});

import { serial, text, pgTable, pgSchema } from "drizzle-orm/pg-core";

export const mySchema = pgSchema("my_schema");

export const admin = mySchema.table('admin', {
    id: serial('id').primaryKey(),
    email: text('email'),
    username: text('username'),
    password: text('password')
});



console.log("RDS CLIENT:");
console.log(rdsClient);
console.log("DATABASE:");
console.log(db);



