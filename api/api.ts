import { Form, sql } from "../data/config.js";

interface Cash {
    [key: number]: Form
}

const cash: Cash = {};

export function formattedText(n: number) {
    return n < 1000 ? n :
    n < 1e6 ? (Math.floor(n / 10) / 100 + "К") : (Math.floor(n / 1e4) / 1e2 + "М")
}

export async function isAdmin(idOrName: number) {
    try {
        if ((await sql.query(`SELECT isAdmin FROM users WHERE id=${idOrName}`)).rows[0].isadmin === true) {
            return true;
        }
        return false;
    } catch (e) {console.log(e)}
};