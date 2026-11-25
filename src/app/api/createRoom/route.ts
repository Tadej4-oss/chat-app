import pool from "@/lib/db"
import  getSession  from "@/lib/auth"

export async function POST(request: Request){
    const user = await getSession()
    if(!user){
        return Response.json({message: "Unauthorized access"}, {status: 401})
    }

    const { roomName } = await request.json()
    
    const room  = await pool.query("INSERT INTO rooms(name) VALUES ($1) RETURNING id, name", [roomName])
    console.log(room.rows[0].id)
    console.log(user.id)

    await pool.query("INSERT INTO room_members(user_id, role, room_id) VALUES ($1, $2, $3)", [user.id, "owner", room.rows[0].id])


    return Response.json(
        {roomid: room.rows[0].id,
        roomName: room.rows[0].name
        },
        {status: 200})
}