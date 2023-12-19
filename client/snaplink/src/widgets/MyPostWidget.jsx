import { ImageOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from 'react';
import { Input } from '@mui/material';
import UserImage from '../components/UserImage';
import { useSelector, useDispatch } from 'react-redux';
import { setPosts } from '../state';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";

function MyPostWidget({ picturePath }) {
  const dispatch = useDispatch();
  const [_id] = useSelector((state) => [state.user._id]);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const mode = useSelector((state)=>state.mode)

  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState('');

  async function handlePost() {
    try{
    const loading = toast.loading("Loading...");
    let formData = new FormData();
    formData.append('userId', _id);
    formData.append('description', post);
    if (image) {
      formData.append('picture', image);
    }

    const posts = await axios.post('https://snaplink-backend.onrender.com/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    if(!posts)toast.error("Something went wrong!");
    dispatch(setPosts({ posts: posts.data }));
    navigate('/home');
    setImage(null);
    setPost('');
    setIsImage(false);
    toast.dismiss(loading);
    toast.success("Posted Sucessfully");
  }
  catch(err){
    toast.error("Err Connecting...");
    console.log(err.message);
  }
  }

  return (
    <div className={`p-4 ${mode=="dark"?"bg-slate-900":"bg-white"} transition-colors duration-500 rounded-lg`}>
      <div className="flex justify-between items-center gap-5">
        <UserImage image={picturePath} size='3' />
        <Input
          className={`rounded-xl px-4 py-4 w-full ${mode === "dark" ? "bg-gray-800" : "bg-gray-200"} transition-colors duration-500`}
          placeholder="What's on your Mind..."
          sx={{color: `${mode === "dark" ? "white" : "black"}`}}
          value={post}
          onChange={(e) => {
            setPost(e.target.value);
          }}
        />
      </div>
      {isImage && (
        <div className="border-2 border-blue-500 rounded-md mt-4 p-4 transition-all">
          <input className={`${mode=="dark"?"text-gray-200":"text-gray-800"}`} type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        
      )}
      <div className="my-4">
      <hr/>
      </div>
      <div className="flex justify-between items-center gap-5">
        <div
          onClick={() => {
            setIsImage(!isImage);
          }}
          className="flex items-center gap-1 cursor-pointer"
        >
          <ImageOutlined className="text-blue-500" />
          <span className="text-blue-500 font-semibold hover:text-blue-400">   Add Image</span>
        </div>
        <Button
          disabled={!post}
          onClick={handlePost}
          className="text-blue-400 hover:text-blue-500 rounded-md"
        >
          <div className="text-blue-500 font-semibold hover:text-blue-400 cursor-pointer">POST</div>
        </Button>
      </div>
    </div>
  );
}

export default MyPostWidget;
