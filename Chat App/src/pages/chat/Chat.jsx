import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import LeftSideBar from "./../../components/leftSideBar/LeftSideBar";
import RightSideBar from "./../../components/rightSideBar/RightSideBar";
import ChatBox from "../../components/chatBox/ChatBox";
import { StoreContext } from "../../context/context";

const Chat = () => {
  const { chatData, userData } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [userData, chatData]);

  return (
    <div className="chat">
      {loading ? (
        <p className="loading">loading</p>
      ) : (
        <div className="chat-container">
          <LeftSideBar />
          <ChatBox />
          <RightSideBar />
        </div>
      )}
    </div>
  );
};

export default Chat;
