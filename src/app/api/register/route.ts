import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    const { username, password } = await request.json()

    const checkUser = await pool.query("SELECT * FROM users WHERE username = $1", [username])
    if (checkUser.rows.length > 0) {
        return Response.json(
            { message: "User already exists" },
            { status: 400 },
        )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.query("INSERT INTO users (username, password_hash) VALUES ($1, $2)", [username, hashedPassword])

    return Response.json(
        { message: "Registration successful!", user: username , password: password },
        { status: 200 },
    )
}