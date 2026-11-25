import { cookies } from "next/headers";
import crypto from  "crypto"
import pool from "./db";

export default async function getSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value

    if(!token){
        return false
    }
    
    const hashedToken = crypto.createHash("sha256")
        .update(token)
        .digest("hex")

    const verifyToken = await pool.query(
        `SELECT users.*
        FROM users
        JOIN sessions ON users.id = sessions.user_id
        WHERE sessions.token_hash = $1
        AND sessions.expires_at > NOW()`,
        [hashedToken]
);

    if (verifyToken.rows.length === 0) {
        return false;
    }

    const user = verifyToken.rows[0]
    

    return  user ;
}
