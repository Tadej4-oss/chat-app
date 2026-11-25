import getSession from "@/lib/auth";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(){
    const cookieStore = await cookies()
    const user = await getSession()

    if(!user){
        cookieStore.delete("session_token")
    }

    cookieStore.delete("session_token")

    await pool.query("DELETE FROM sessions WHERE user_id = $1", [user.id])

    return Response.json(
        {message: "Logged Out"},
        {status: 200}
    )

}