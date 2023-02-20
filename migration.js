import pg from "pg";
import "dotenv/config";

const {Client} = pg;

const sql = new Client({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
});

await sql.connect();

const sql2 = new Client({
    host: "ziggy.db.elephantsql.com",
    user: "ytecvquq",
    database: "ytecvquq",
    password: "akuV_ceO-mU1hfgMfPSpfZ3WF_9S4f7f",
})

await sql2.connect();

const data = (await sql2.query("SELECT * FROM users")).rows

data.forEach(async v => {
    if (!v.cards) return
    await sql.query(`INSERT INTO users (id, name, bals, coins, time, vip, vipcoins, bafs, cards, packs, isadmin, resets, level) values (${v.id}, '${v.name}', ${v.bals}, ${v.coins}, 0, ${Date.now() + 86400000}, 0, ARRAY${JSON.stringify(v.cards)}::integer[], ARRAY${JSON.stringify(v.cards)}::integer[], ARRAY[]::integer[], false, 0, 0)`)
    console.log(v)
})