export type User = {
    username: string,
    id: number,
}

export type Rooms = {
    id: number,
    name: string
}


export type ChatProps = {
    rooms: Rooms[],
    currentRoom: number,
    user: User,
}

export type Conversation = {
    contexts: string,
    username: string
}

export type searchedUser = {
    username: string
}

export type roomUsers = {
    id: number,
    username: string,
    role: string
}