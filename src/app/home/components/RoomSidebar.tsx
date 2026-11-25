import { useState } from "react";
import type { Rooms } from "../../ChatTypes";

type RoomSidebarProps = {
  rooms: Rooms[];
  currentRoom: number;
  userRole: string | null;
  onSelectRoom: (roomId: number) => void;
  onEditRoom: (roomId: number) => void;
  onDeleteRoom: (roomId: number) => void;
};

export default function RoomSidebar({
  rooms,
  currentRoom,
  userRole,
  onSelectRoom,
  onEditRoom,
  onDeleteRoom,
}: RoomSidebarProps) {
  const [roomDropdownOpen, setRoomDropdownOpen] = useState<number | null>(null);

  return (
    <aside className="chat-sidebar rooms-sidebar">
      <div className="sidebar-heading">
        <span className="sidebar-indicator" />
        <h2>Chat Rooms</h2>
      </div>

      <div className="sidebar-list">
        {roomDropdownOpen !== null && (
          <div className="dropdown-overlay" onClick={() => setRoomDropdownOpen(null)} />
        )}
        {rooms.map((room) => (
          <div
            className={`room-item-container ${room.id === currentRoom ? "selected" : ""}`}
            key={room.id}
          >
            <div
              onClick={() => onSelectRoom(room.id)}
              className="room-item"
            >
              <span className="room-hash">#</span>
              <span>{room?.name}</span>
            </div>


            {room.name !== "global" && userRole !==  "member" && currentRoom === room.id ? (
              <div className="dropdown">
                <button
                  type="button"
                  className="dropdown-toggle"
                  aria-label="Room options"
                  onClick={() =>
                    setRoomDropdownOpen(roomDropdownOpen === room.id ? null : room.id)
                  } 
                >
                  •••
                </button>
                {roomDropdownOpen === room.id && (
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setRoomDropdownOpen(null);
                        onEditRoom(room.id);
                      }}
                    >
                      Edit Room
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setRoomDropdownOpen(null);
                        onDeleteRoom(room.id);
                      }}
                    >
                      Delete Room
                    </button>
                  </div>
                )}
              </div>
            ):(
            <>{room.name !== "global" && currentRoom === room.id && (
              <div className="dropdown">
                <button
                  type="button"
                  className="dropdown-toggle"
                  aria-label="Room options"
                  onClick={() =>
                    setRoomDropdownOpen(roomDropdownOpen === room.id ? null : room.id)
                  } 
                >
                  •••
                </button>
                {roomDropdownOpen === room.id && (
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setRoomDropdownOpen(null);
                        onEditRoom(room.id);
                      }}
                    >
                      Options
                    </button>
                  </div>
                )}
              </div>
            )}
            </>)}

          
          </div>
        ))}
      </div>

      <label htmlFor="create-room-popup">Create Room</label>
    </aside>
  );
}
