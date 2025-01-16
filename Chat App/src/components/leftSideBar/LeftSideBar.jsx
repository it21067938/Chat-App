import React, { useContext, useState } from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { StoreContext } from "../../context/context";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userData } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  //search function
  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          setUser(querySnap.docs[0].data());
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.log(error);
    }
  };


// Perform a search, select a person from the results, and save their data upon selection



  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.chatAppIcon} alt="" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here..."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div className="friends add-friends">
            <img src={assets.person_icon} alt="" />
            <p>{user.username}</p>{" "}
          </div>
        ) : (
          Array(12)
            .fill("")
            .map((item, index) => (
              <div key={index} className="friends">
                <img src={assets.profile_img} alt="" />
                <div>
                  <p></p>
                  <span>Hello, HoKiara Harrisw are you?</span>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
