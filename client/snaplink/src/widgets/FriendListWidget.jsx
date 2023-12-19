import { Typography } from '@mui/material';
import Friend from '../components/Friend';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

function FriendListWidget({ userId }) {
  const token = useSelector((state) => state.token);
  const [friends, setFriends] = useState([]);
  const change = useSelector((state) => state.change);
  const mode = useSelector((state)=>state.mode);

  async function getFriends() {
    try{
    const { data } = await axios.get(`https://snaplink-backend.onrender.com/users/${userId}/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setFriends(data);
  }
  catch(err){
    toast.error("Err Connecting...");
    console.log(err.message);
  }
  }

  useEffect(() => {
    getFriends();
  }, [change]);

  return (
    <div className={`pt-6 pr-1 ${mode === "dark" ? 'bg-slate-900' : 'bg-white'} transition-colors duration-500 pb-6 pl-6 rounded-lg`}>
      <Typography variant="h5" className="">
        <div className={`${mode === "dark" ? 'text-gray-200' : 'text-gray-800'} font-semibold`}>Friend List</div>
      </Typography>
      <div className="flex flex-col gap-3 overflow-y-auto mt-3 pr-2" style={{ maxHeight: '265px' }}>
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
            className="flex items-center justify-between p-4 bg-blue-850 rounded-md"
          />
        ))}
      </div>
    </div>
  );
}

export default FriendListWidget;
