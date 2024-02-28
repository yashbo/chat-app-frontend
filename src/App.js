import React from "react";
import { BrowserRouter, Routes,  Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ResigterPage from "./pages/RegisterPage";
import IndexPage from "./pages/indexPage";
import ChatroomPage from "./pages/ChatroomPage";
import io from 'socket.io-client'
import makeToast from "./Toaster";
import ErrorBoundary from './ErrorBoundary';
import axios from "axios";
axios.defaults.baseURL = 'http://localhost:8000';
function App(){
  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    if(token&&!socket){
      const newsocket = io("http://localhost:8000", {
        query:{
            token:localStorage.getItem("CC_Token"),
        },
    });

    newsocket.on("disconnect", ()=>{
      setSocket(null);
      setTimeout(setupSocket, 3000);
      makeToast("error", "Socket disconnected");
    });

    newsocket.on("connect", () => {
      makeToast("success", "Socket Connected!");
    });
    setSocket(newsocket);
    }
  }
React.useEffect(()=>{
  setupSocket();
  //eslint-disable-next-line
},[])
    return( 
    <ErrorBoundary><BrowserRouter>
      <Routes>
      <Route path="/chatroom/:chatroomId" element={<ChatroomPage socket={socket} />} exact />
        <Route path="/" element={<IndexPage/>} exact/>
        <Route path="/login" element={ <LoginPage setupSocket={setupSocket}/>}exact/> 
        <Route path="/register" element={<ResigterPage />} exact/>
        <Route path="/dashboard" element={<DashboardPage socket={socket} />} exact />

      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
    );
};



export default App;