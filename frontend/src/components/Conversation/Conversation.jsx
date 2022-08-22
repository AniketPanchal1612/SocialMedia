import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getUser } from "../../api/UserRequest";
import "./Conversation.css";
const Conversation = ({ data, currentUserId,online }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUserId);
    console.log(userId);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, []);
  return (
    <>
      <div className="follower conversation">
        <div> 
          
          {online && <div className="online-dot"></div>}
          
          <img
            src={
              userData?.profilePicture
                ? "http://localhost:5000/images/" + userData.profilePicture
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
            <span style={{color: online?"#51e200":""}}>{online? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
