import { drizzle } from 'drizzle-orm/aws-data-api/pg';
import { RDSDataClient } from '@aws-sdk/client-rds-data';
import { fromIni } from '@aws-sdk/credential-providers';
import { serial, text, pgTable, pgSchema } from "drizzle-orm/pg-core";
import dotenv from 'dotenv'
import { tblAdmin, tblGameInstance, tblPlayer, tblPlayerRound, tblRoundInstance, tblUniverse, tblUniverseRound } from "./schema"
dotenv.config();

//NB: to create a profile on your local machine
//create file: Users/<username>./aws/credentials
//go to aws console > click on name in top right > security credentials
//create access key

export const rdsClient = new RDSDataClient({
    credentials: fromIni({ profile: process.env['PROFILE'] }),
    region: 'us-east-1',
});

const db = drizzle(rdsClient, {
    database: (process.env['NODE_ENV'] == "test" ) ? process.env['TEST_DATABASE'] : process.env['DATABASE']!,
    secretArn: process.env['SECRET_ARN']!,
    resourceArn: process.env['RESOURCE_ARN']!,
});

const mySchema = pgSchema("my_schema");

export {
    db
}