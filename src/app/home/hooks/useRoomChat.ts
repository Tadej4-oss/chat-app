import { useEffect, useRef, useState } from "react";
import type { Conversation, roomUsers } from "../../ChatTypes";

export function useRoomChat(currentRoom: number, username?: string) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [roomUsers, setRoomUsers] = useState<roomUsers[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socketRef.current = socket;
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    socket.onopen = () => {
      console.log("Connected");
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: "join_room", roomId: currentRoom }));
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "typing") {
        setTypingUser(data.username);
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }

      if (data.type === "new_message") {
        setConversations((prevConversations) => [
          ...prevConversations,
          { contexts: data.message, username: data.username },
        ]);
      }
    };

    async function getRoomData() {
      const res = await fetch(`/api/messages/${currentRoom}`);
      const data = await res.json();
      setConversations(data.conversations);
      setUserRole(data.role);
      setRoomUsers(data.users);
      console.log(data);
    }

    void getRoomData();

    return () => {
      console.log("Closing WebSocket connection");
      socket.close();
      socketRef.current = null;
    };
  }, [currentRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [conversations]);

  async function sendMessage(message: string) {
    const res = await fetch(`/api/messages/${currentRoom}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    console.log(data);
  }

  function sendTyping() {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type: "typing", roomId: currentRoom, username }),
      );
    }
  }

  return {
    userRole,
    conversations,
    isTyping,
    typingUser,
    roomUsers,
    setRoomUsers,
    bottomRef,
    sendMessage,
    sendTyping,
  };
}
