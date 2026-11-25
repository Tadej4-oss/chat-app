import pool from "@/lib/db"
import HomeClient from "./HomeClient"
import getSession from "@/lib/auth"
import { notFound, redirect } from "next/navigation"

export default async function Home(){
    const user = await getSession()
    if(!user){
        redirect("/login")
    }
    const users = await pool.query("SELECT id, username FROM users")
    const getGlobal = await pool.query("SELECT * FROM rooms WHERE name = $1", ["global"])

    if(getGlobal.rows.length === 0){
        await pool.query("INSERT INTO rooms (name) VALUES ('global');")
    }

    if(user){
        await pool.query(`
        INSERT INTO room_members (user_id, room_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, room_id) DO NOTHING;
        `, [user.id, getGlobal.rows[0].id])
    }

    const rooms = await pool.query(`
        SELECT rooms.id, rooms.name FROM rooms 
            JOIN room_members ON room_members.room_id = rooms.id
            WHERE room_members.user_id = $1 ORDER BY rooms.name ASC`, [user.id])

    
    return(
    <>
     <HomeClient users = {users.rows} rooms = {rooms.rows} />
    </>
    )
    
    

   

}