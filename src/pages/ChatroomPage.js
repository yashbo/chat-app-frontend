import React, { useState, useEffect, useRef } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import makeToast from '../Toaster';

export default function ChatroomPage({ match, socket }) {
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userId, setUserId] = useState("");
  const [chatroomName, setChatroomName] = useState("");
  const chatroomId = params.chatroomId;

  const fetchChatroomName = async () => {
    try {
      const response = await axios.get(`/api/getChatroomNameById/${chatroomId}`);
      setChatroomName(response.data.name);
    } catch (error) {
      console.error("Error fetching chatroom name:", error.response ? error.response.data : error.message);
      // Handle the error or set a default chatroom name if needed
    }
  };

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId: chatroomId,
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessage = [...messages, message];
        setMessages(newMessage);
      });
    }
  }, [socket, messages]);

  useEffect(() => {
    fetchChatroomName();
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
  }, [chatroomId, socket]);

  return (
    <ErrorBoundary>
      <div className='chatroomPage'>
        <div className='chatroomSection'>
          <div className='cardHeader'>{chatroomName}</div>
          <div className='chatroomContent'>
            {messages.map((message, i) => (
              <div key={i} className='message'>
                <span
                  className={
                    userId === message.userId ? "ownMessage" : "otherMessage"
                  }
                >
                  {message.name}:
                </span>{" "}
                {message.message};
              </div>
            ))}
          </div>
          <div className='chatroomActions'>
            <div>
              <input
                type='text'
                name='message'
                placeholder='Say something!'
                ref={messageRef}
              />
            </div>
            <div>
              <button className='join' onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
