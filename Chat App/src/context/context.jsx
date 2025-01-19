import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const StoreContext = createContext();

export const StoreContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);

  const [messageId, setMessageID] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  //rightside chat visible set in small screen
  const [chatVisible, setChatVisible] = useState(false);

  const navigate = useNavigate();

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setUserData(userData);

      //if avatar or name not, then navigate to edit profile
      if (!userData.avatar && !userData.name) {
        navigate("/profile");
      } else {
        navigate("/chat");
      }

      await updateDoc(userRef, {
        lastSeen: Date.now(),
      });

      setInterval(async () => {
        if (auth.chatUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chat", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data().chatData;
        const tempData = [];
        for (const item of chatItems) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          tempData.push({ ...item, userData });
        }
        setChatData(tempData.sort((a, b) => b.updateAt - a.updateAt));
      });
      return () => {
        unSub();
      };
    }
  }, [userData]);

  const contextValue = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    messageId,
    setMessageID,
    chatUser,
    setChatUser,
    chatVisible,
    setChatVisible,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
