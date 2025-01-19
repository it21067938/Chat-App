import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import assets from "./../../assets/assets";
import { StoreContext } from "../../context/context";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";

const ChatBox = () => {
  const {
    userData,
    messageId,
    setMessages,
    chatUser,
    messages,
    chatVisible,
    setChatVisible,
  } = useContext(StoreContext);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input && messageId) {
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatRef = doc(db, "chat", id);
          const userChatSnap = await getDoc(userChatRef);

          if (userChatSnap.exists()) {
            const userChatData = userChatSnap.data();
            console.log(userChatData);

            const chatIndex = userChatData.chatData.findIndex(
              (c) => c.messageId === messageId
            );
            userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatRef, {
              chatData: userChatData.chatData,
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setInput("");
  };

  useEffect(() => {
    if (messageId) {
      const unSub = onSnapshot(doc(db, "messages", messageId), (res) => {
        setMessages(res.data().messages.reverse());
      });
    }
  }, [messageId]);

  //convert timestamp
  const convertTime = (timeStamp) => {
    let date = timeStamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    if (hour > 12) {
      return hour - 12 + ":" + minute + " PM";
    } else {
      return hour + ":" + minute + " AM";
    }
  };

  return chatUser ? (
    <div className={`"chat-box ${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user">
        <img src={assets.profile_img} alt="" />
        <p>
          {chatUser.userData.name}{" "}
          <img src={assets.green_dot} className="dot" alt="" />
        </p>
        <img src={assets.help_icon} className="help" alt="" />
        <img src={assets.back_icon} onClick={()=>setChatVisible(false)} className="arrow" alt="" />
      </div>
      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
          >
            <p className="msg">{msg.text}</p>
            <div>
              <img src={assets.person_icon} alt="" />
              <p>{convertTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a Message"
        />
        <input type="file" id="image" accept="image/png, image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className={`"chat-welcome ${chatVisible ? "" : "hidden"}`}>
      <img className="chatBox-logo" src={assets.logo} alt="" />
    </div>
  );
};

export default ChatBox;
