import pool from "@/lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {cookies} from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  const {username, password} = await request.json();


  if (!username || !password) {
    return Response.json(
      { message: "Username and password are required" },
      { status: 400 },
    );
  }

  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

  if (result.rows.length === 0) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  const user = result.rows[0];
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    return Response.json({ message: "Invalid credentials" }, { status: 400 });
  }

  //create, hash,set httponly and store session token in database

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256")
    .update(token)
    .digest("hex")
  
  
  await pool.query("INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)", [user.id, hashedToken, new Date(Date.now() + 60 * 60 * 1000 * 7)]); // 1 day expiration

  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 7, // 1 day
    path: "/",
  });



  return Response.json(
    { message: "Login successful!", user: { id: user.id, username: user.username } },
    { status: 200 },
  );
}
