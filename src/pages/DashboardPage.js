import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import makeToast from '../Toaster';
import { Link } from 'react-router-dom';

export default function DashboardPage(props) {
  const [chatrooms, setChatrooms] = useState([]);
  const chatroomNameRef = useRef(null);

  const getChatrooms = () => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  useEffect(() => {
    getChatrooms();
    //eslint-disable-next-line
  },[]);
  
  const createChatroom = () => {
    const chatroomName = chatroomNameRef.current.value;

    axios
      .post("http://localhost:8000/chatroom", {
        name: chatroomName,
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        makeToast("success", response.data.message);
        getChatrooms();
        chatroomNameRef.current.value = "";
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };
  const deleteChatroom = async(chatroomId) =>{
    try{
    await axios.delete(`/api/findByIdAndDelete/${chatroomId}`);
  setChatrooms((prevChatrooms) => prevChatrooms.filter(chatroom => chatroom._id !== chatroomId));
  makeToast("success", "Chatroom deleted successfully");
  getChatrooms();
}
catch(error){
  console.error("Error deleting chatroom: ", error);
  makeToast("error", error.message);
}
  }
  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            ref={chatroomNameRef}
            placeholder="ChatterBox Nepal"
          />
        </div>
      </div>
      <button onClick={createChatroom}>Create Chatroom</button>
      <div className="chatrooms">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <div>
              <button>
            <Link to={{ pathname: `/chatroom/${chatroom._id}`, state: { chatroomName: chatroom.name } }}>
  <div className="join">Join</div>
</Link></button></div>
<div>
<button onClick={() => deleteChatroom(chatroom._id)}>Delete</button>

</div>


          </div>
        ))}
      </div>
    </div>
  );
};
