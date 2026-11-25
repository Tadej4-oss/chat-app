import pool from "@/lib/db"

export async function GET(request: Request, { params } : {params: Promise<{username: string}>}){
    const { username } = await params

    if (!username || typeof username !== "string") {
        return Response.json({message: "invalid input"}, {status: 404})
    }

    const user = await pool.query("SELECT username FROM users WHERE username ILIKE $1", [username])
    if(user.rows.length === 0){
        return Response.json({message: "could not find user"}, {status: 404})
    }
    return Response.json({user: user.rows[0]}, {status: 200})
}

export async function DELETE(request: Request){
    const { user, room } = await request.json()

    if(!Number.isInteger(user) || user <= 0){
        return Response.json({message: "invalid User"}, {status: 400})
    }

    if(!Number.isInteger(room) || room <= 0){
        return Response.json({message: "room not found"}, {status: 400})
    }

    const res = await pool.query("DELETE FROM room_members WHERE user_id = $1 AND room_id =$2 RETURNING id", [user, room])

    if(res.rowCount === 0){
        return Response.json({message: "Could not delete user"}, {status: 400})
    }
    

    return Response.json(
        {message: "Deleted Successfuly"},
        {status: 200}
    )
}