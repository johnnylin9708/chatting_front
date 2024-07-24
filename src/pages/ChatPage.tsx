import {
  getAllConnections,
  insertMessage,
  queryMessagesByConnectionId,
} from "API";
import Dialog from "components/Dialog";
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";

interface Connection {
  id: string;
  connectionId: string;
  userId: string;
  userEmail: string;
  friendId: string;
  friendEmail: string;
}

interface ChatMessage {
  id: string;
  connectionId: string;
  senderId: string;
  senderEmail: string;
  receiverEmail: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

const ChatPage: React.FC = () => {
  const [socket, setSocket] = useState<any>();
  const navigate = useNavigate();

  const userId = localStorage.getItem("_u");

  const [connections, setConnections] = useState<Connection[]>([]);
  const [currentChatTarget, setCurrentChatTarget] =
    useState<Connection | null>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newMessage.trim() !== "") {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      let senderId,
        senderEmail,
        receiverEmail,
        receiverId = "";

      if (currentChatTarget && currentChatTarget?.userId === userId) {
        senderId = currentChatTarget.userId || "";
        senderEmail = currentChatTarget.userEmail || "";
        receiverId = currentChatTarget.friendId || "";
        receiverEmail = currentChatTarget.friendEmail || "";
      } else {
        senderId = currentChatTarget?.friendId || "";
        senderEmail = currentChatTarget?.friendEmail || "";
        receiverId = currentChatTarget?.userId || "";
        receiverEmail = currentChatTarget?.userEmail || "";
      }

      const newChatMessageInfo: ChatMessage = {
        id: `${messages.length + 1}`,
        connectionId: currentChatTarget?.connectionId || "",
        senderId,
        senderEmail,
        receiverEmail,
        receiverId,
        text: newMessage,
        timestamp: Date.now(),
      };

      await insertMessage(newChatMessageInfo);

      setMessages([...messages, newChatMessageInfo]);
      setNewMessage("");
      socket.emit("chatMessage", newChatMessageInfo);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("_u")) {
      navigate("/login");
    }
    async function fetch() {
      const userId = localStorage.getItem("_u") || "";
      const getAllconnectionsRes = await getAllConnections(userId);
      setConnections(getAllconnectionsRes.data);
    }
    fetch();
  }, []);

  useEffect(() => {
    async function fetch() {
      if (currentChatTarget) {
        const messages = await queryMessagesByConnectionId(
          currentChatTarget.connectionId
        );
        setMessages(messages.data);
      }
    }
    fetch();
  }, [currentChatTarget]);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_GATEWAY_URL || "", {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ["websocket"],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
    });
    // const newSocket = io("https://chatting-backend-c0nt.onrender.com");
    setSocket(newSocket);
    if (userId) {
      newSocket.on("connect", () => {
        console.log("connected");
        newSocket.emit("join", userId);
      });
      newSocket.on("chatMessage", (msg: ChatMessage) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
      newSocket.on(userId, (newConnection: Connection) => {
        setConnections((prevConnections) => [
          ...prevConnections,
          newConnection,
        ]);
      });
    }

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <>
      <button
        className="m-5 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          localStorage.removeItem("_u");
          localStorage.removeItem("_t");
          navigate("/login");
        }}
      >
        Logout
      </button>
      <div className="flex h-screen">
        {/* Connections list */}

        <div className="bg-white shadow-md border-r border-gray-200 p-6 w-1/4">
          <div className="flex">
            <h2 className="text-lg font-bold mb-4">Friends</h2>
            <Dialog socket={socket} />
          </div>
          <ul className="space-y-2">
            {connections.map((connection) => (
              <li
                key={connection.id}
                className="flex items-center hover:bg-gray-100 rounded-md p-2 cursor-pointer"
                onClick={() => setCurrentChatTarget(connection)}
              >
                <FaUserCircle className="w-10 h-10 rounded-full mr-4" />
                <div>
                  <h3 className="text-sm font-medium">
                    {userId === connection.userId
                      ? connection.friendEmail
                      : connection.userEmail}
                  </h3>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat message area */}
        <div className="flex-1 bg-white shadow-md border-r border-gray-200 p-6">
          {currentChatTarget && (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => {
                    if (message.senderId === userId) {
                      return (
                        <div key={message.id} className="flex items-start">
                          <FaUserCircle className="w-10 h-10 rounded-full mr-4" />
                          <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                            <h3 className="text-sm font-medium mb-1">
                              {currentChatTarget.userId === userId
                                ? currentChatTarget.userEmail
                                : currentChatTarget.friendEmail}
                            </h3>
                            <p className="text-gray-700">{message.text}</p>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={message.id}
                          className="flex justify-end items-start"
                        >
                          <FaUserCircle className="w-10 h-10 rounded-full mr-4" />
                          <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                            <h3 className="text-sm font-medium mb-1">
                              {currentChatTarget.userId !== userId
                                ? currentChatTarget.userEmail
                                : currentChatTarget.friendEmail}
                            </h3>
                            <p className="text-gray-700">{message.text}</p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMessage}
                  onChange={handleMessageChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
