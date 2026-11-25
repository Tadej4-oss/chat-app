import { useState } from "react";
import type { Rooms, roomUsers } from "../../ChatTypes";

type EditRoomDialogProps = {
  rooms: Rooms[]
  roomId: number | null;
  room?: Rooms;
  userRole: string | null;
  roomUsers: roomUsers[];
  onClose: () => void;
  onMemberAdded: (member: roomUsers) => void;
  onChangeRoom: (id: number | null) => void;
  onMemberRemove: (id: number) => void;
};

export default function EditRoomDialog({
  roomId,
  room,
  userRole,
  roomUsers,
  onClose,
  onMemberAdded,
  onChangeRoom,
  onMemberRemove
}: EditRoomDialogProps) {
  const [searchUser, setSearchUser] = useState("");
  const [getUser, setGetUser] = useState<{ username: string }>();
  const [memberPendingRemoval, setMemberPendingRemoval] = useState<roomUsers | null>(null);

  async function addUserToRoom() {
    if (roomId === null) {
      return;
    }

    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          addUser: getUser?.username,
        }),
      });
      if (!res.ok) {
        console.log("fetch failed ");
        return;
      }

      const data = await res.json();
      onMemberAdded({
        id: data.id,
        username: data.username,
        role: data.role,
      });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function searchForUser() {
    try {
      const res = await fetch(`/api/users/${searchUser}`);
      if (!res.ok) {
        console.log("fetch failed ");
        return;
      }

      const data = await res.json();
      setGetUser(data.user);
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setSearchUser("");
    }
  }

  async function LeaveRoom(){
    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "PATCH",
        headers: {
          "Content-type" : "application/json"
        },
        body: JSON.stringify({
          roomId,
          type: "leave_room"
        })
      })

      if(res.status !== 200){
        console.log("could not leave room")
      }

      const data = await res.json()
      onChangeRoom(roomId)
      console.log(data)
    } catch (error) {
      console.log(error)
    }

  }

  async function removeUser(id: number) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type" : "application/json"
        },
        body: JSON.stringify({
          user: id,
          room: roomId
        })
      })

      const data = await res.json()
      console.log(data)
      onMemberRemove(id)
    } catch (error) {
      console.log(error)
    }
  }

  if (roomId === null) {
    return null;
  }

  return (
    <>
      <button
        className="edit-room-backdrop"
        type="button"
        aria-label="Close room editor"
        onClick={onClose}
      />
      <div
        className="edit-room-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-room-title"
      >
        <p className="edit-room-title" id="edit-room-title">
          {room?.name}
        </p>
        <div className="edit-room-section">
          <p className="edit-room-section-title">Members</p>
          <div className="edit-room-members">
            {roomUsers?.map((user) => (
              <div className="edit-room-member" key={user.id}>
                <div>
                  <p className="edit-room-member-name">{user.username}</p>
                  <p className="edit-room-member-role">{user.role}</p>
                </div>
                {userRole === "owner" && user.role !== "owner" && (
                  <button 
                    onClick={() => {
                        setMemberPendingRemoval(user);
                      }}
                      className="edit-room-remove"
                      type="button"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        {userRole === "owner" ? (
          <div className="edit-room-section">
          <p className="edit-room-section-title">Add a member</p>
          <div className="edit-room-search">
            <input
              className="edit-room-search-input"
              value={searchUser}
              onChange={(event) => setSearchUser(event.target.value)}
              placeholder="Enter username..."
            />
            <button className="edit-room-search-button" type="button" onClick={searchForUser}>
              Search
            </button>
          </div>
          {getUser && (
            <>
              <p className="edit-room-section-title">Search result:</p>
              <div className="edit-room-search-result">
                <p>{getUser.username}</p>
                <button className="edit-room-add-button" type="button" onClick={addUserToRoom}>
                  Add
                </button>
              </div>
            </>
          )}
        </div>
        ) : (
          <button
            className="edit-room-leave-button"
            type="button"
            onClick={LeaveRoom}
          >
            Leave Room
          </button>
        )}
      </div>

      {memberPendingRemoval !== null && (
        <div className="remove-member-overlay" role="presentation">
          <div
            className="remove-member-confirmation"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-member-title"
          >
            <p className="remove-member-title" id="remove-member-title">
              Remove {memberPendingRemoval.username}?
            </p>
            <p className="remove-member-description">
              This member will lose access to the room.
            </p>
            <div className="remove-member-actions">
              <button
                className="remove-member-cancel"
                type="button"
                onClick={() => setMemberPendingRemoval(null)}
              >
                Cancel
              </button>
              <button
                className="remove-member-confirm"
                type="button"
                onClick={() => {
                  removeUser(memberPendingRemoval.id);
                  setMemberPendingRemoval(null);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
