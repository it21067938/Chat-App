import React from "react";
import "./RightSideBar.css";
import assets from "./../../assets/assets";
import { logOut } from "../../config/firebase";

const RightSideBar = () => {
  return (
    <div className="rs">
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" />
        <h3>
          Kiara Harris <img className="dot" src={assets.green_dot} alt="" />
        </h3>
        <p>Hey, There i am Kiara Harris using TalkLoop</p>
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
  );
};

export default RightSideBar;
