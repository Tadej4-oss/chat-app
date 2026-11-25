"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Rooms, User } from "../ChatTypes";
import ChatPanel from "./components/ChatPanel";
import CreateRoomDialog from "./components/CreateRoomDialog";
import DeleteRoomDialog from "./components/DeleteRoomDialog";
import EditRoomDialog from "./components/EditRoomDialog";
import RoomSidebar from "./components/RoomSidebar";
import { useHomeSession } from "./hooks/useHomeSession";
import { useRoomChat } from "./hooks/useRoomChat";
import "./home.css";

type HomeClientProps = {
  users: User[];
  rooms: Rooms[];
};

export default function HomeClient({ users, rooms }: HomeClientProps) {
  const [roomList, setRoomList] = useState<Rooms[]>(rooms);
  const [roomName, setRoomName] = useState("");
  const [currentRoom, setCurrentRoom] = useState<number>(rooms[0]?.id);
  const [confirmDeleteRoom, setConfirmDeleteRoom] = useState<number | null>(null);
  const [roomToEdit, setRoomToEdit] = useState<number | null>(null);
  
  const router = useRouter();
  const { user, loading, error } = useHomeSession();
  const chat = useRoomChat(currentRoom, user?.username);

  const activeRoom = rooms.find((room) => room.id === currentRoom);
  const roomToDelete = rooms.find((room) => room.id === confirmDeleteRoom);
  const editRoom = rooms.find((room) => room.id === roomToEdit);

  async function createRoom() {
    try {
      const res = await fetch("/api/createRoom", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ roomName }),
      });

      const data = await res.json();
      setRoomList(prev => [...prev, {
        id: data.roomid,
        name: data.roomName
      }]);
      setCurrentRoom(rooms[0].id)
      console.log(data);
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setRoomName("");
      router.refresh();
    }
  }

  async function deleteRoom(roomId: number) {
    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        console.log(`Room ${roomId} deleted successfully.`);
        setConfirmDeleteRoom(null);
        setCurrentRoom(rooms[0].id);
        setRoomList(prev => prev.filter(room => room.id !== roomId));
        router.refresh();
      } else {
        console.error(`Failed to delete room ${roomId}.`);
      }
    } catch (error) {
      console.error(`Error deleting room ${roomId}:`, error);
    }
  }

  async function getRoomMembers(roomId: number) {
    try {
      const res = await fetch(`/api/rooms/${roomId}`);
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  function editRoomMembers(roomId: number) {
    void getRoomMembers(roomId);
    setRoomToEdit(roomId);
  }

  if (loading) {
    return (
      <main className="app-loading" role="status" aria-live="polite">
        <section className="app-loading__card">
          <span className="app-loading__spinner" aria-hidden="true" />
          <div>
            <p className="app-loading__title">Loading your chat</p>
            <p className="app-loading__description">
              Getting your conversations ready...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-loading">
        <section className="app-loading__card" role="alert">
          <div>
            <p className="app-loading__title">Couldn't load your chat</p>
            <p className="app-loading__description">{error}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <input type="checkbox" id="create-room-popup" style={{ display: "none" }} />
      <label id="overlay" htmlFor="create-room-popup" />
      <div className="chat-layout">
        {/* LEFT SIDEBAR */}
        <aside className="chat-sidebar users-sidebar">
          <div className="sidebar-heading">
            <span className="sidebar-indicator" />
            <h2>Users</h2>
            <span className="sidebar-count">X</span>
          </div>

          <div className="sidebar-list">
            {users.map((user) => (
              <div className="user-item" key={user.id}>
                <span>{user.username}</span>
                <span className="online-dot" />
              </div>
            ))}
          </div>
        </aside>

        <ChatPanel
          username={user?.username}
          roomName={activeRoom?.name}
          conversations={chat.conversations}
          isTyping={chat.isTyping}
          typingUser={chat.typingUser}
          bottomRef={chat.bottomRef}
          onSendMessage={chat.sendMessage}
          onTyping={chat.sendTyping}
        />

        <RoomSidebar
          rooms={roomList}
          currentRoom={currentRoom}
          userRole={chat.userRole}
          onSelectRoom={setCurrentRoom}
          onEditRoom={editRoomMembers}
          onDeleteRoom={setConfirmDeleteRoom}
        />
      </div>

      <CreateRoomDialog
        roomName={roomName}
        onRoomNameChange={setRoomName}
        onCreateRoom={createRoom}
      />

      {roomToDelete && (
        <DeleteRoomDialog
          room={roomToDelete}
          onClose={() => setConfirmDeleteRoom(null)}
          onDelete={deleteRoom}
        />
      )}

      <EditRoomDialog
        rooms={roomList}
        roomId={roomToEdit}
        room={editRoom}
        userRole={chat.userRole}
        roomUsers={chat.roomUsers}
        onClose={() => setRoomToEdit(null)}
        onMemberAdded={(member) =>
          chat.setRoomUsers((previousMembers) => [...previousMembers, member])
        }
        onChangeRoom={(id) => {
          setRoomList(prev => prev.filter(room => room.id !== id));
          console.log("room list:", roomList);
        }}
        onMemberRemove={(id) => 
          chat.setRoomUsers(prev => prev.filter(member => member.id !== id))
        }
      />
    </>
  );
}
