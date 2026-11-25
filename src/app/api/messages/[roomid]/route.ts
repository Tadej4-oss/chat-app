import pool from "@/lib/db"
import getSession from "@/lib/auth"

export async function GET(request: Request, {params} : {params: Promise<{roomid: string}>}){
    const user = await getSession()
    const {roomid} = await params
    const parsedRoomId = Number(roomid)

    if (!Number.isInteger(parsedRoomId) || parsedRoomId <= 0) {
        return Response.json({ error: "Invalid room ID" }, { status: 400 })
    }

    const room = await pool.query(
        "SELECT id, name FROM rooms WHERE id = $1",
        [parsedRoomId],
    )

    if (room.rows.length === 0) {
        return Response.json({ error: "Room not found" }, { status: 404 })
    }


    const conversations = await pool.query(
        `SELECT conversations.contexts, users.username
            FROM conversations
            JOIN rooms ON conversations.room_id = rooms.id
            JOIN users ON conversations.sender_id = users.id
            WHERE rooms.id = $1
            ORDER BY conversations.id ASC;`,
        [parsedRoomId],
    )


    const roomUsers = await pool.query(`
        SELECT users.username, users.id, room_members.role 
            FROM users 
            JOIN room_members ON room_members.user_id = users.id
            WHERE room_members.room_id = $1`, [parsedRoomId])

    if(room.rows[0].name === "global"){
        return Response.json({ 
            conversations: conversations.rows,
            users: roomUsers.rows,
         }, { status: 200 })
    }
    
    const role = await pool.query("SELECT role FROM room_members WHERE user_id = $1 AND room_id = $2", [user.id, parsedRoomId])

    return Response.json({ 
        conversations: conversations.rows,
        role: role.rows[0].role,
        users: roomUsers.rows,
        }, { status: 200 })
}

export async function POST(request: Request, {params} : {params: Promise<{roomid: string}>}) {
    const user = await getSession()

    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {message} = await request.json()
    const {roomid} = await params
    const senderId = user.id

    await pool.query(
        `INSERT INTO conversations (contexts, sender_id, room_id)
        VALUES ($1, $2, $3)`,
        [message, senderId, roomid]
    )

    const broadcastResponse = await fetch(`${process.env.WEBSOCKET_INTERNAL_URL}/broadcast`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ type: "new_message", roomId: roomid, message, username: user.username })
    })

    if (!broadcastResponse.ok) {
        console.error("Message saved, but broadcast failed")
    }
    
    return Response.json({message: `stored in db`})
}
