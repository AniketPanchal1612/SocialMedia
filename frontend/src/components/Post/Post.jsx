import React from 'react';
import './Post.css'
import Comment from '../../img/comment.png'
import Share from '../../img/share.png'
import Heart from '../../img/like.png'
import Notlike from '../../img/notlike.png'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { likePost } from '../../api/PostRequest';



const Post = ({data}) => {
  const {user} = useSelector((state)=>state.authReducer.authData)
  
  const [liked,setLiked]= useState(data.likes.includes(user._id))
  const [likes,setLikes]= useState(data.likes.length)

  const handleLike=()=>{
    setLiked((prev)=>!prev)
    likePost(data._id, user._id)
    liked? setLikes((prev)=> prev-1):setLikes((prev)=>prev+1)
  }

  
  return (
    <div className="Post">
            <img src={data.image ? "http://localhost:5000/images/"+data.image :""} alt="" />
            <post className="postReact">
                <img src={liked? Heart:Notlike} alt="" style={{cursor:"pointer"}}
                onClick={handleLike}
                />
                <img src={Comment} alt="" />
                <img src={Share} alt="" />
            </post>
            <span style={{color: "var(--gray)", fontSize:"12px"}}>{likes} likes</span>
            <div className="detail">
                <span><b>{data.name}</b> </span>
                <span>{data.desc}</span>
            </div>
        </div>
  )
}

export default Post