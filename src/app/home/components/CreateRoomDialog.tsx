type CreateRoomDialogProps = {
  roomName: string;
  onRoomNameChange: (roomName: string) => void;
  onCreateRoom: () => void;
};

export default function CreateRoomDialog({
  roomName,
  onRoomNameChange,
  onCreateRoom,
}: CreateRoomDialogProps) {
  return (
    <div
      className="create-room-div"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-room-title"
    >
      <div className="create-room-card">
        <label
          className="create-room-close"
          htmlFor="create-room-popup"
          aria-label="Close create room dialog"
        >
          ×
        </label>
        <div className="create-room-icon" aria-hidden="true">
          ✦
        </div>
        <p className="create-room-eyebrow">NEW SPACE</p>
        <h2 id="create-room-title">Create a room</h2>
        <p className="create-room-description">
          Start a new space to bring your conversations together.
        </p>
        <input
          value={roomName}
          onChange={(event) => onRoomNameChange(event.target.value)}
          className="create-room-input"
          placeholder="Room Name"
        />
        <button className="create-room-submit" type="button" onClick={onCreateRoom}>
          Create room
        </button>
      </div>
    </div>
  );
}
