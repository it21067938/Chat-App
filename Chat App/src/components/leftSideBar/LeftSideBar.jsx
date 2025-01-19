import React, { useContext, useEffect, useState } from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import {
  updateDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { StoreContext } from "../../context/context";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userData, chatData, messageId, setMessageID, chatUser, chatVisible, setChatVisible, setChatUser } =
    useContext(StoreContext);
  StoreContext;
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
          let userExist = false;
          chatData.map((user) => {
            if (user.rId == querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
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
  const addToChat = async () => {
    const messageRef = collection(db, "messages");
    const chatRef = collection(db, "chat");
    try {
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatRef, user.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(chatRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      const uSnap = await getDoc(doc(db, "users", user.id));
      const uData = uSnap.data();
      setChat({
        messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
          userData: uData
      })
      setShowSearch(false);
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  //Show chat , selected user
  const setChat = async (item) => {
    try {
      setMessageID(item.messageId);
      setChatUser(item);
      const userChatRef = doc(db, "chat", userData.id);
      const userChatSnap = await getDoc(userChatRef);
      const userChatData = userChatSnap.data();
      const chatIndex = userChatData.chatData.findIndex(
        (c) => c.messageId === item.messageId
      );
      userChatData.chatData[chatIndex].messageSeen = true;
      await updateDoc(userChatRef, {
        chatData: userChatData.chatData,
      });
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const updateChatUserData = async() => {
      if (chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser(prev => ({...prev, userData:userData}));
      }
    }
    updateChatUserData();
  }, [chatData])

  return (
    <div className={`ls ${chatVisible ? "hidden" : ""}`}>
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
          <div onClick={addToChat} className="friends add-friends">
            <img src={assets.person_icon} alt="" />
            <p>{user.username}</p>{" "}
          </div>
        ) : (
          chatData.map((item, index) => (
            <div
              onClick={() => setChat(item)}
              key={index}
              className={`friends ${
                item.messageSeen || item.messageId === messageId ? "" : "border"
              }`}
            >
              <img src={assets.person_icon} alt="" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
