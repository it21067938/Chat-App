import React, { useContext } from "react";
import "./RightSideBar.css";
import assets from "./../../assets/assets";
import { logOut } from "../../config/firebase";
import { StoreContext } from "../../context/context";

const RightSideBar = () => {

  const {chatUser } = useContext(StoreContext);
  
  return chatUser ?(
    <div className="rs">
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" />
        <h3>{chatUser.userData.name}
        <img className="dot" src={assets.green_dot} alt="" />
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr className="rs-hr"/>
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
        </div>
      </div>
      <button onClick={() => logOut()}>Logout</button>
    </div>
  ) : <div className="rs">
    <button onClick={() => logOut()}>Logout</button>
  </div>
};

export default RightSideBar;
