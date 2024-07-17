import {Knex} from "knex";
import config from "./config"

export const baseKnexConfig:Knex.Config={
    client:config.database.DB_CLIENT,
    connection:{
        host:config.database.DB_HOST,
        port:+config.database.DB_PORT!,
        user:config.database.DB_USER,
        password:config.database.DB_PW,
        database:config.database.DB_NAME
    }
}

const knexConfig:Knex.Config={
    ...baseKnexConfig,
    migrations:{
        directory:"./database/migration",
        tableName:"migrations",
        extension:"ts",
        stub:"./stubs/migration.stub"
    },
    seeds:{
        directory:"./database/seeds/",
        extension:"ts",
        stub:"./stubs/seed.stub"
    }
}

export default knexConfig;