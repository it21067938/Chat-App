import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const StoreContext = createContext();

export const StoreContextProvider = (props) => {
  const [userData, setUserData] = useState("");
  const [chatData, setChatData] = useState("");

  const navigate = useNavigate();

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setUserData(userData);
      console.log(userData);

      //if avatar or name not, then navigate to edit profile
      if (!userData.avatar && !userData.name) {
        navigate("/profile");
      } else {
        navigate("/chat");
      }

      await updateDoc(userRef, {
        lastSeen: Date.now()
      })

      setInterval(async() => {
        if (auth.chatUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          })
        }
      }, 60000)

     
    } catch (error) {
      console.log(error);
    }
  };

  const contextValue = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
