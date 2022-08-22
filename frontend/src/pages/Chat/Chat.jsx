import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userChats } from "../../api/ChatRequest";
import Conversation from "../../components/Conversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import {io} from 'socket.io-client'
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import "./Chat.css";
import ChatBox from "../../components/ChatBox/ChatBox";
import { useRef } from "react";
const Chat = () => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [onlineUsers, setOnlineUsers] = useState([])
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage , setSendMessage] = useState(null)
  const [receiveMessage , setReceiveMessage] = useState(null)
  const socket = useRef()

  

  //receive message from socket server
  
  
  useEffect(()=>{
    socket.current = io('http://localhost:8800')
    socket.current.emit("new-user-add", user._id)
    socket.current.on('get-user', (users)=>{
      setOnlineUsers(users);
    })
  },[user])
  

  //fetch chats
  //userchats-> intract with database
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        setChats(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user]);

  //send message to socket server
  useEffect(()=>{
    if(sendMessage !==null){
      socket.current.emit('send-message',sendMessage)
    }
  },[sendMessage])

  useEffect(()=>{
    socket.current.on('receive-message',(data)=>{
      setReceiveMessage(data)
    })
  },[])
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div onClick={() => setCurrentChat(chat)}>
                <Conversation data={chat} currentUserId={user._id} online = {checkOnlineStatus(chat)}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <div className="navIcons">
            <Link to="../home">
              <img src={Home} alt="" />
            </Link>
            <UilSetting />

            <img src={Noti} alt="" />
            <Link to="../chat">
              <img src={Comment} alt="" />
            </Link>
          </div>
        </div>
        {/* Chat Body */}
        <ChatBox chat={currentChat} currentUser={user._id}
        setSendMessage={setSendMessage}
        receiveMessage={receiveMessage} />
      </div>
    </div>
  );
};

export default Chat;
