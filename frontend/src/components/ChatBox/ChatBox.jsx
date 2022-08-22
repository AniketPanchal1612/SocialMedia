import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { addMessage, getMessages } from "../../api/MessageRequest.js";
import { getUser } from "../../api/UserRequest";
import "./ChatBox.css";
import {format} from 'timeago.js'
import InputEmoji from 'react-input-emoji'
import { useRef } from "react";


const ChatBox = ({ chat, currentUser,setSendMessage ,receiveMessage}) => {
  const [userData, setuserData] = useState(null);
  const [messages,setMessages] = useState([])
  const [newMessage,setNewMessage] = useState("")
  const scroll = useRef()
  
  useEffect(()=>{
    if(receiveMessage !==null && receiveMessage.chatId===chat?._id){
      setMessages([...messages,receiveMessage])
    }
  },[receiveMessage])

  //fetching data for headers
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setuserData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  //fetching data for messages
  useEffect(()=>{
    const fetchMessages = async()=>{
        try {
            const {data} = await getMessages(chat._id);
            console.log(data)
            setMessages(data)
        } catch (error) {
            console.log(error)
        }
    }
    if(chat !== null) fetchMessages();
  },[chat])

  const handleChange=(newMessage)=>{
    setNewMessage(newMessage)
}

const handleSend = async(e)=>{
  e.preventDefault();
  const message ={
    senderId : currentUser,
    text: newMessage,
    chatId: chat._id
  }
  //send message to database
  try {
    const {data} = await addMessage(message);
    setMessages([...messages, data])
    setNewMessage("")
  } catch (error) {
    console.log(error)
  }
  //send message to socket server
  const receiverId = chat.members.find((id)=>id!== currentUser)
  setSendMessage({...message,receiverId})

}
//Always scroll to the last message
useEffect(()=>{
  scroll.current?.scrollIntoView({behavior: "smooth"})
},[messages])


  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
        <>
        <div className="chat-header">
          <div className="follower">
            <div>
              <img
                src={
                  userData?.profilePicture
                    ? "http://localhost:5000/images/" +
                      userData.profilePicture
                    : "http://localhost:5000/images/profile.png"
                }
                alt=""
                style={{ width: "50px", height: "50px" }}
                className="followerImage"
              />
              <div className="name" style={{ fontSize: "0.8rem" }}>
                <span>
                  {userData?.firstname} {userData?.lastname}
                </span>
                {/* <span>Online</span> */}
              </div>
            </div>
          </div>
          <hr
              style={{
                width: "95%",
                border: "0.1px solid #ececec",
                marginTop: "20px",
              }}/>
        </div>
        {/* ChatBox Messages */}

        <div className="chat-body">
              {messages.map((message)=>(
                  <>

                  <div
                  ref={scroll}  className={message.senderId===currentUser? "message own":"message"}
                      >
                      <span>{message.text}</span>
                      <span>{format(message.createdAt)}</span>
                  </div>
                  </>

              ))}
        </div>

        {/* chat-sender */}
          <div className="chat-sender">
              <div>+</div>
              <InputEmoji 
              
              value={newMessage}
              onChange ={handleChange}
              />
              <div className="send-button button" onClick={handleSend}>Send</div>
          </div>
      </>): (
        <span className="chatbox-empty-message">
            Tap on a Chat to start Conversation...
        </span>
      )
        }
        
      </div>
    </>
  );
};

export default ChatBox;
