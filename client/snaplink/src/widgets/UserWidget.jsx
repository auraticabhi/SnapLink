import { ManageAccountsOutlined, EditOutlined, LocationOnOutlined, WorkOutlineOutlined } from '@mui/icons-material'
import {Box, Typography} from "@mui/material";
import twitter from "../assets/twitter.png"
import UserImage from '../components/UserImage';
import linkedin from "../assets/linkedin.png"
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { setUserx } from '../state';
import { setPosts } from '../state';
import toast from 'react-hot-toast';
import axios from 'axios';

function UserWidget({ userId, picturePath }) {
    const lcn = useLocation();
    const {pathname} = lcn;
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const mode = useSelector((state)=>state.mode);
    const userid = useSelector((state)=>state.user._id);
    const token = useSelector((state)=>{return state.token});
    const [image, setImage] = useState(null);
    let chng = useSelector((state)=>state.change);
    
    //console.log(mode, " ", pathname);
    async function getUser(){
        try{
        const data= await axios.get(`https://snaplink-backend.onrender.com/users/${userId}`, {headers: {Authorization: `Bearer ${token}`}});
        console.log(data.data);
        setUser(data.data);
        }
        catch(err){
            toast.error("Err Connecting...");
            console.log(err.message);
        }
    }

    async function uploadImage() {
        if (image == null) {
          alert('Please select an image before Uploading');
          return;
        }

        const lg = toast.loading("Loading...");
      
        const img = new Image();
        img.src = URL.createObjectURL(image);
      
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
      
          const aspectRatio = 1; 
          const { width, height } = img;
          const size = Math.min(width, height);
          canvas.width = size;
          canvas.height = size;
      
          ctx.drawImage(
            img,
            (width - size) / 2,
            (height - size) / 2,
            size,
            size,
            0,
            0,
            canvas.width,
            canvas.height
          );
      
          canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('id', userid);
            formData.append('picture', blob);
      
            try {
              const user = await axios.patch('https://snaplink-backend.onrender.com/users/upload', formData, {
                headers: {
                  'content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
                },
              });
      
              dispatch(setUserx({ user: user.data }));
              if (pathname.split('/')[1] == 'profile') {
                getUserPosts(pathname.split('/')[2]);
              } else {
                getPosts();
              }
              setImage(null);
              setIsImage(false);
              toast.dismiss(lg);
              toast.success("PfP changed Sucessfully");
            } catch (error) {
              console.error('Error uploading image:', error);
              toast.error("Error changing pfp")
            }
          });
        };
      }
      
    async function getPosts(){
        try{
        let {data} = await axios.get("https://snaplink-backend.onrender.com/posts", {
            headers: { "Authorization": `Bearer ${token}`}
        });
        // console.log(data);
        dispatch(setPosts({posts: data}));
    }
    catch(err){
        toast.error("Err Connecting...");
        console.log(err.message);
    }
    }

    async function getUserPosts(id){
        try{
        const {data} = await axios.get(`https://snaplink-backend.onrender.com/posts/${id}/posts`, {
            headers: { "Authorization": `Bearer ${token}`}
        });
        console.log("user", data);
        dispatch(setPosts({posts: data}));
    }
    catch(err){
        toast.error("Err Connecting...");
        console.log(err.message);
    }
    }

    // async function deleteAccount(){
    //     const data=await axios.patch('https://snaplink-backend.onrender.com/users/delete', {
    //         user: userId,
    //         loggedUser: userid
    //     }, 
    //     {
    //         headers: { "Authorization": `Bearer ${token}`}
    //     }
    //     );
    //     console.log(data);
    //     dispatch(setLogout());
    // }

    useEffect(()=>{
        getUser();
    }, [chng]);

    if(!user)return <Loading/>

    const {
        firstName, 
        lastName, 
        location, 
        occupation, 
        viewedProfile, 
        impressions, 
        friends
    } = user;

    return (
        <div>
            {!user ? (<Loading />) : (
                <div className={`p-6 ${mode === "dark" ? 'bg-slate-900' : 'bg-white'} rounded-lg transition-colors duration-500`}>
                    <div onClick={() => { navigate(`/profile/${userId}`) }} className='flex justify-between items-center gap-2 pb-4'>
                        <div className='flex items-center gap-4'>
                            <UserImage image={picturePath} />
                            <Box>
                                <Typography variant='h6'>
                                <div className={`${mode === "dark" ? 'text-white' : 'text-black'} hover:text-blue-400 cursor-pointer`}>
                                    <div className="font-semibold">{firstName} {lastName}</div>
                                </div>    
                                </Typography>
                                <Typography className="text-blue-400 font-semibold">
                                    <div className='font-semibold'>Total Friends: {friends.length}</div>
                                </Typography>
                            </Box>
                        </div>
                        <div className={`${userid !== userId ? "hidden" : ""} text-white`} onClick={(e) => { e.stopPropagation(); }}>
                            <div onClick={() => {
                                setIsImage(!isImage)
                            }}>
                                <ManageAccountsOutlined className={`${mode === "dark" ? 'text-gray-200' : 'text-gray-800'} cursor-pointer`} />
                            </div>
                        </div>
                    </div>

                    <div className='text-white'>
                    <hr/>
                    {isImage && (
                                <div id={`${pathname=="/home"?"imgbx":""}`}>
                                <Box className={`${mode === "dark" ? 'bg-gray-700' : 'bg-gray-200'} mt-4 pr-1 p-3 rounded-md`}>
                                    <input type="file" className={`${mode === "dark" ? 'text-gray-200' : 'text-gray-800'}`} onChange={(e) => { setImage(e.target.files[0]) }} />
                                    <button className="mt-2 font-semibold text-blue-400 hover:text-blue-500" onClick={uploadImage}>
                                        Upload Img
                                    </button>
                                </Box>
                                </div>
                            )}
                    </div>
                    <div className='mt-4'/>   
                    

                    <Box className="px-4 py-0">
                        <Box className="flex items-center gap-4 mb-2">
                            <LocationOnOutlined className={`text-${mode === "dark" ? 'white' : 'black'} text-lg`} />
                            <Typography className={`text-blue-400 ${mode === "dark" ? 'text-white' : 'text-black'}`}>{location}</Typography>
                        </Box>
                        <Box className="flex items-center gap-4">
                            <WorkOutlineOutlined className={`text-${mode === "dark" ? 'white' : 'black'} text-lg`} />
                            <Typography className={`text-blue-400 ${mode === "dark" ? 'text-white' : 'text-black'}`}>{occupation}</Typography>
                        </Box>
                    </Box>
                    
                
                        <Box className=''>
                        <hr className="mt-3"/>
                            <div className="flex justify-between items-center p-4">
                                <Typography className='text-blue-400'>
                                    Who's viewed your Profile
                                </Typography>
                                <Typography className={`${mode === "dark" ? 'text-gray-200' : 'text-gray-800'}`}>{viewedProfile}</Typography>
                            </div>
                            <div className='flex justify-between items-center p-4'>
                                <Typography className="text-blue-400">
                                    Impressions of your Post
                                </Typography>
                                <Typography className={`${mode === "dark" ? 'text-gray-200' : 'text-gray-800'}`}>
                                    {impressions}
                                </Typography>
                            </div>
                        </Box>

                    
                        <Box className="px-2 py-0">
                            <Typography variant='h6' className={`mb-4 ${mode === "dark" ? 'text-gray-200' : 'text-gray-800'}`}>
                                <div className="font-medium">Social Profiles</div>
                            </Typography>
                            <div className="flex flex-row justify-between items-center p-2 gap-4 mb-2 mt-2">
                                <div className='g-4'>
                                <div className='flex gap-3'>
                                    <img id="smedia" src={twitter} alt="twitter" />
                                    <Box>
                                        <Typography className={`${mode === "dark" ? 'text-gray-200' : 'text-gray-800'}`}>
                                            Twitter
                                        </Typography>
                                        <Typography className='text-blue-400 hover:text-blue-300 cursor-pointer' onClick={()=>{alert("Currently UnAvailble!")}}>Social Network</Typography>
                                    </Box>
                                </div>    
                                </div>
                                <EditOutlined className='text-blue-950'/>
                            </div>

                            <div className="flex justify-between items-center p-2 gap-4">
                                <div className='g-4'>
                                <div className="flex gap-3">
                                    <img id='smedia' src={linkedin} alt="LinkedIn" />
                                    <Box>
                                        <Typography className={`${mode === "dark" ? 'text-gray-200' : 'text-gray-800'}`}>
                                            LinkedIn
                                        </Typography>
                                        <Typography className='text-blue-400 hover:text-blue-300 cursor-pointer' onClick={()=>{alert("Currently UnAvailble!")}}>Network Platform</Typography>
                                    </Box>
                                    </div>
                                </div>
                                <EditOutlined className='text-blue-950'/>
                            </div>
                        </Box>
                        {/* <div className={`${userId===userid?"":"hidden"}`} onClick={deleteAccount}>
                            Delete Account <DeleteForeverTwoTone/>
                        </div> */}
                </div>
            )}
        </div>
    )
}

export default UserWidget;
