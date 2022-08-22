import { Modal, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../actions/uploadAction";
import { updateUser } from "../../actions/userAction";


function ProfileModal({ modalOpened, setModalOpened,data }) {
  const theme = useMantineTheme();

  const {password,...other}=data;
  const[formData,setFormData] = useState(other)
  const [profileImage , setProfileImage]= useState(null)
  const[coverImage,setCoverImage]= useState(null)
  const dispatch=useDispatch()
  const params = useParams()
  const {user} = useSelector((state)=>state.authReducer.authData)

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const onImageChange =(event)=>{
    if(event.target.files && event.target.files[0]){
      let img = event.target.files[0];
      event.target.name==='profileImage'?
      setProfileImage(img) : setCoverImage(img);
    }
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    let UserData = formData;
    if(profileImage){
      const data = new FormData();
      const fileName = Date.now()+profileImage.name;
      data.append("name",fileName);
      data.append("file",profileImage);
      UserData.profilePicture =fileName;
      try {
        dispatch(uploadImage(data))
      } catch (error) {
        console.log(error)
      }
    }
    if(coverImage){
      const data = new FormData();
      const fileName = Date.now()+coverImage.name;
      data.append("name",fileName);
      data.append("file",coverImage);
      UserData.coverPicture =fileName;

      try {
        dispatch(uploadImage(data))
      } catch (error) {
        console.log(error)
      }
    }
    dispatch(updateUser(params.id,UserData))
    setModalOpened(false)
  }
  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <form action="" className="infoForm">
        <h3>Your Info</h3>

        <div>
          <input
            type="text"
            placeholder="First Name"
            className="infoInput"
            name="firstname"
            onChange={handleChange}
            value={formData.firstname}
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastname"
            className="infoInput"
            onChange={handleChange}
            value={formData.lastname}


          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Works at"
            name="worksAt"
            className="infoInput"
            onChange={handleChange}
            value={formData.worksAt}
/>
        </div>
        <div>
          <input
            type="text"
            placeholder="Lives in"
            className="infoInput"
            onChange={handleChange}
            name="livesin"
            value={formData.livesin}
          />
          <input
            type="text"
            placeholder="Country"
            name="country"
            onChange={handleChange}
            className="infoInput"
            value={formData.country}

          /> 
        </div>
        <div>
          <input
            type="text"
            placeholder="Relation Status"
            name='relationship'
            onChange={handleChange}
            className="infoInput"
            value={formData.relationship}
          />
        </div>
        <div>
          Profile Image
          <input type="file" onChange={onImageChange} name="profileImage" id="" />
          Cover Image
          <input type="file" onChange={onImageChange} name="coverImage" id="" />
        </div>
        <button className="button infoButton" onClick={handleSubmit}>Update</button>
      </form>
    </Modal>
  );
}

export default ProfileModal;
