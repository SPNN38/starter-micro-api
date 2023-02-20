import pg from "pg";
import "dotenv/config";

const {Client} = pg;

export const token = process.env.TOKEN || "";

export const sql = new Client({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
});

await sql.connect();

export const usersInDB = new Set();

export let isMaintenance = false;

export function setMaintenance() {
    isMaintenance = !isMaintenance;
}

export let cards = (await sql.query("SELECT * FROM cards")).rows[0];

export interface Baf {
    type: "coins" | "bals" | "time" | "card",
    baf: number,
}

interface Pack{}

export interface Form {
    name: string,
    id: number,
    bals: number,
    coins: number,
    vipcoins: number,
    cards: number[],
    vip: number,
    resets: number,
    levels: number,
    packs: Pack[],
    bafs: Baf[],
    time: number,
    isAdmin: boolean,

}