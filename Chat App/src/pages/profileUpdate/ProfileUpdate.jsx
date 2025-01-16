import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/context";

const ProfileUpdate = () => {
  const [image, setImage] = useState(false);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [previousImage, setPreviousImage] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useContext(StoreContext);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPreviousImage(docSnap.data().avatar);
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // try {
    //   if (!previousImage && !image) {
    //     toast.error("Upload Profile Picture");
    //   }

    // const docRef = doc(db, "users", uid);
    //   if (image) {
    //     const imgURL = await upload(image);
    //     setPreviousImage(imgURL);
    //     await updateDoc(docRef, {
    //       avatar: imgURL,
    //       bio: bio,
    //       name: name,
    //     });
    //   }
    // } catch (error) {
    //   await updateDoc(docRef, {
    //     bio: bio,
    //     name: name,
    //   });
    // }

    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        bio: bio,
        name: name,
      });

      //update the context variable
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      toast.success("Profile Update Successfully");
      navigate("/chat");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <div className="profile-header">
            <img onClick={() => navigate("/chat")} className="backIcon" src={assets.back_icon} alt="" />
            <h3>Profile Details</h3>
          </div>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpeg, .jpg"
              hidden
            />
            <img
              className="profilePic"
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt=""
            />
            Upload Profile Image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your Name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.bio)}
            value={bio}
            placeholder="Write Profile Bio"
            required
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          src={image ? URL.createObjectURL(image) : assets.logo}
          className="chatAppIcon"
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
