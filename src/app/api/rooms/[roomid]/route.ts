import getSession from "@/lib/auth";
import pool from "@/lib/db";

export async function DELETE(request: Request, {params} : {params: Promise<{roomid: string}>}) {
    const { roomid } = await params;
    console.log(`Deleting room with ID: ${roomid}`);

    // Delete the room from the database
    await pool.query("DELETE FROM rooms WHERE id = $1", [roomid]);

    return Response.json(
        { message: `Room ${roomid} deleted successfully.` },
        { status: 200 }
    );
}

export async function GET(request: Request, {params}: {params: Promise<{roomid: string}>}) {
    const {roomid} = await params

    if(!roomid){
        return Response.json({message: "could not find room"}, {status: 400})
    }
    
    const res = await pool.query("SELECT username FROM users JOIN room_members ON room_members.user_id = users.id WHERE room_members.room_id = $1", [roomid])
    const data = res.rows
    
    console.log(data)

    return Response.json({message: roomid}, {status: 200})
}

export async function PATCH(request: Request, {params} : {params: Promise<{roomid: string}>}){
    const user = await getSession()
    const {roomid} = await params
    const { addUser, type }  = await request.json()

    if(type === "leave_room"){
        await pool.query("DELETE FROM room_members WHERE user_id = $1 AND room_id = $2", [user.id, roomid])
        return Response.json({message:`leave room. USER : ${user.username}`}, {status: 200})
    }

    if(!roomid || !addUser){
        return Response.json({message:`bad values`}, {status: 404})
    }

    const userCheck = await pool.query("SELECT id, username FROM users WHERE username ILIKE $1", [addUser])
    if(userCheck.rows.length === 0){
        return Response.json({message:`user not found`}, {status: 404})
    }

    const res = await pool.query("INSERT INTO room_members(room_id, user_id) VALUES ($1, $2) RETURNING role", [roomid, userCheck.rows[0].id])

    return Response.json({userid: userCheck.rows[0].id, username: userCheck.rows[0].username, role: res.rows[0].role}, {status: 200})
}