import React from "react";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import ProfileImage from "../../img/profileImg.jpg";
import { useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../../actions/uploadAction";
const PostShare = () => {
  const loading = useSelector((state)=>state.postReducer.uploading)

    const [image,setImage] = useState(null)
    const  imageRef = useRef();
    const dispatch = useDispatch()
    const desc = useRef();
    const {user}= useSelector((state)=>state.authReducer.authData)

    const onImageChange=(event)=>{
        if(event.target.files && event.target.files[0]){
            let img = event.target.files[0];
            setImage(img)
        }
    }

    const reset=()=>{
      setImage(null)
      desc.current.value=""
    }

    const handleSubmit =(e)=>{
      e.preventDefault();

      const newPost = {
        userId : user._id,
        desc: desc.current.value
      }
      if(image){
        const data = new FormData();
        const filename = Date.now() + image.name;
        data.append("name",filename)
        data.append("file",image) 
        newPost.image = filename
        console.log(newPost)
        try {
          dispatch(uploadImage(data))
        } catch (error) {
          console.log(error)
        }
      }
      dispatch(uploadPost(newPost))
      reset()
    }

  return (
    <div className="PostShare">
      <img src={user.defaultPicture? "http://localhost:5000/images/" + user.defaultPicture : "http://localhost:5000/images/profile.png"} alt="" />
      <div>
        <input type="text" placeholder="What's happening"
        ref = {desc}
        required
        />
        <div className="postOption">
          <div className="option" style={{ color: "var(--photo)" }}
          onClick ={(()=>imageRef.current.click())}>
            <UilScenery />
            Photo
          </div>
          <div className="option" style={{ color: "var(--video)" }}>
            <UilPlayCircle />
            Video
          </div>
          <div className="option" style={{ color: "var(--location)" }}>
            <UilLocationPoint />
            Location
          </div>
          <div className="option" style={{ color: "var(--schedule)" }}>
            <UilSchedule />
            Schedule
          </div>
          <button className="button ps-button"
          disabled={loading}
          onClick={handleSubmit}
          >{loading ? "Uploading..." : "Share"}</button>
            <div style={{display:"none"}}>

                <input type="file" name="myImage" id="" ref={imageRef} onChange={onImageChange} />
            </div>
        </div>
        {image && (
            <div className="previewImage">
                <UilTimes onClick={()=>setImage(null)} />
                <img src={URL.createObjectURL(image)} alt="" />

            </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
