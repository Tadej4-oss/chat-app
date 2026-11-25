import type { Rooms } from "../../ChatTypes";

type DeleteRoomDialogProps = {
  room: Rooms;
  onClose: () => void;
  onDelete: (roomId: number) => void;
};

export default function DeleteRoomDialog({
  room,
  onClose,
  onDelete,
}: DeleteRoomDialogProps) {
  return (
    <>
      <button
        className="delete-room-overlay"
        type="button"
        aria-label="Close delete room confirmation"
        onClick={onClose}
      />
      <div
        className="delete-room-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-room-title"
        aria-describedby="delete-room-description"
      >
        <div className="delete-room-icon" aria-hidden="true">
          !
        </div>
        <p className="delete-room-eyebrow">ROOM DELETION</p>
        <h2 id="delete-room-title">Delete this room?</h2>
        <p className="delete-room-description" id="delete-room-description">
          You’re about to permanently delete <strong>#{room.name}</strong>. This action can’t be
          undone.
        </p>
        <div className="delete-room-actions">
          <button className="delete-room-cancel" type="button" onClick={onClose}>
            Keep room
          </button>
          <button
            className="delete-room-confirm"
            type="button"
            onClick={() => onDelete(room.id)}
          >
            Delete room
          </button>
        </div>
      </div>
    </>
  );
}
