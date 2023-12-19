import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setFriends, setChange } from '../state';
import toast from 'react-hot-toast';
import UserImage from './UserImage';

function Friend({friendId, name, userPicturePath}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {_id} = useSelector((state)=>state.user);
    const token = useSelector((state)=>{return state.token});
    const mode = useSelector((state)=>state.mode);
    let {friends} = useSelector((state)=>state.user);

    //console.log(friends, friendId);
    const isFriend = friends.find((frnd)=>{return frnd._id==friendId});

    const patchFriend = async()=>{
      try{
        const {data} = await axios.patch(`https://snaplink-backend.onrender.com/users/${_id}/${friendId}`,
        {},  
        {headers: {
            "Authorization": `Bearer ${token}`
        } 
        }
        );
        dispatch(setChange());
        // console.log("patching", data);
        dispatch(setFriends({friends: data}));
        if(isFriend)toast.success("Friend Removed Sucessfully");
        else toast.success("Friend Added Sucessfully");
      }
      catch(err){
        toast.error("Something went wrong");
        console.log(err.message);
      }  
    }

  return (
    <div className='flex justify-between items-center'>
    <div className='flex justify-between items-center pb-4 gap-4'>
      <UserImage image={userPicturePath} size='2' />
      <Box
        onClick={() => {
          navigate(`/profile/${friendId}`);
          dispatch(setChange());
        }}
      >
        <Typography className={`cursor-pointer ${mode=="dark"?"text-gray-200 hover:text-gray-100":"text-gray-800 hover:text-gray-900"}`} variant='h6'>
          <div className='font-bold'>{name}</div>
        </Typography>
      </Box>
    </div>
    <div className={`${_id === friendId ? 'hidden' : ''}`}>
    <IconButton onClick={()=>{patchFriend()}} className={`rounded-xl p-2`}>
            {
                isFriend?(<PersonRemoveOutlined className={`${mode=="dark"?"text-gray-200":"text-gray-800"}`}/>):(<PersonAddOutlined className={`${mode=="dark"?"text-gray-200":"text-gray-800"}`} />)
            }
        </IconButton>
    </div>
  </div>
  )
}

export default Friend
