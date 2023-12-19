import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import FriendListWidget from '../../widgets/FriendListWidget';
import MyPostWidget from '../../widgets/MyPostWidget';
import PostWidget from '../../widgets/PostWidget';
import UserWidget from '../../widgets/UserWidget';
import axios from 'axios';
import Loading from '../../components/Loading';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const luser = useSelector((state) => state.user);
  const change = useSelector((state) => state.change);
  const token = useSelector((state) => state.token);
  const mode = useSelector((state)=>state.mode);

  const getUser = async () => {
    try {
      if (luser && userId === luser._id) {
        setUser(luser);
      } else {
        const { data } = await axios.get(`https://snaplink-backend.onrender.com/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        //dispatch(setUserx({user: data}));
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId, luser, change, token]);

  return (
    <div>
      {!user ? (
        <Loading />
      ) : (
        <div className="h-full flex flex-col">
          <Navbar />
          <div className={`${mode === "dark" ? 'bg-gray-950' : 'bg-gray-200'} transition-colors duration-500 md:flex flex-grow justify-center items-start pt-10 px-4`}>
            <Box className="md:w-1/3">
              <UserWidget userId={userId} picturePath={user.picturePath} />
              <br/>
              <FriendListWidget userId={userId} />
              <br/>
            </Box>
            <br/>
            <Box className="md:w-2/3 pl-4">
            <h4 className={`md:hidden text-center underline font-semibold ${mode === "dark" ? 'text-gray-200' : 'text-gray-800'}`}>User Posts</h4>
            <div className='hidden md:block'>
              <MyPostWidget picturePath={luser.picturePath} />
              </div>
              <br/>
              <PostWidget userId={userId} isProfile />
              <br/>
              <h3 className={`${mode === "dark" ? 'text-gray-200' : 'text-gray-800'} text-center font-bold`}>Happy Scrolling!..</h3>
              <br/>
            </Box>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
