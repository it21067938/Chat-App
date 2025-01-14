import React, { useState } from 'react'
import "./ProfileUpdate.css"
import assets from '../../assets/assets'

const ProfileUpdate = () => {

  const [image, setImage] = useState(false);

  return (
    <div className='profile'>
      <div className="profile-container">
        <form>
          <h3>Profile Details</h3>
          <label htmlFor='avatar'>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpeg, .jpg' hidden />
            <img className='profilePic'  src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            Upload Profile Image
          </label>
          <input type="text" placeholder='Your Name' required />
          <textarea placeholder='Write Profile Bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        <img className='chatAppIcon' src={assets.logo} alt="" />
      </div>
      
    </div>
  )
}

export default ProfileUpdate
