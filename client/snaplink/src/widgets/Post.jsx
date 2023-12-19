import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { Box, Divider, IconButton, Typography } from "@mui/material";
import Friend from '../components/Friend';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPost, setPosts } from '../state';
import toast from 'react-hot-toast';

function Post({ postId, postUserId, name, description, location, picturePath, userPicturePath, likes, comments }) {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const [comment, setComment] = useState('');
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const nm = useSelector((state) => state.user.firstName + ' ' + state.user.lastName);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;

    async function patchLike() {
        try {
            const { data } = await axios.patch(`http://localhost:3001/posts/${postId}/like`, {
                userId: loggedInUserId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            dispatch(setPost({ post: data }));
        } catch (error) {
            toast.error("Something went wrong");
            console.error('Error patching like:', error);
        }
    }

    async function addComment() {
        try {
            if (!comment) {
                alert('Please write something before commenting');
                return;
            }

            const { data } = await axios.patch(`http://localhost:3001/posts/${postId}/comment`, {
                name: nm,
                comment
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setComment('');
            dispatch(setPost({ post: data }));
            toast.success("Comment Added");
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error("Could not add Comment");
        }
    }

    const mode = useSelector((state)=>state.mode);
    async function deletePost() {
        try {
            const { data: posts } = await axios.patch(`http://localhost:3001/posts/${postId}/delete`, {
                user: loggedInUserId,
                postUser: postUserId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            dispatch(setPosts({ posts }));
            toast.success("Deleted sucessfully");
            
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className={`rounded-lg ${mode=="dark"?"bg-slate-900 text-white":"bg-white text-gray-950"} transition-colors duration-500 mx-6 my-4 p-4`}>
            <div>
            <Friend friendId={postUserId} name={name} subtitle={location} userPicturePath={userPicturePath} />
            </div>
            <Typography>
                <div className="font-semibold">{description}</div>
            </Typography>

            {picturePath !== 'N/A' && (
                <img className="rounded-md mt-3 w-full object-contain" alt="post" src={picturePath} />
            )}

            <div className="flex justify-between items-center mt-2">
                <div className="flex justify-between items-center gap-4">
                    <div className="flex justify-between items-center gap-2">
                        <IconButton onClick={patchLike}>
                            {isLiked ? (<FavoriteOutlined className="text-pink-500" />) : (<FavoriteBorderOutlined className="text-pink-500" />)}
                        </IconButton>
                        <Typography className="">
                            {likeCount}
                        </Typography>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <IconButton onClick={() => { setIsComments(!isComments) }}>
                            <ChatBubbleOutlineOutlined className="text-green-500" />
                        </IconButton>
                        <Typography className="">
                            {comments.length}
                        </Typography>
                    </div>
                </div>

                <div className={`${loggedInUserId !== postUserId ? 'hidden' : ''}`}>
                    <IconButton onClick={deletePost}>
                        <DeleteOutlineOutlined className='text-red-700' />
                    </IconButton>
                </div>
            </div>

            {isComments && (
                <div>
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => { setComment(e.target.value) }}
                        placeholder="Comment..."
                        className="rounded-md bg-gray-200 text-gray-800 px-3 py-1 mt-2"
                    />
                    <button className="text-white bg-blue-500 rounded-md px-3 py-1 ml-2 mt-2" onClick={addComment}>
                        Post
                    </button>

                    <Box className="mt-3">
                        {comments.map((comment, i) => (
                            <Box key={`${name}-${i}`} className="mb-1">
                                <Divider sx={{background: `${mode=="light"?"gray":"aliceblue"}`}} />
                                <Typography className="mx-2 my-0 pl-4">
                                    <div className='text-blue-400 text-sm font-semibold mt-1'>
                                    {comment.split(`${postId}/0`)[0]}
                                    </div>
                                    <div className={`${mode=="dark"?"text-gray-200":"text-gray-800"} mt-1 mr-1`}>
                                    <h4>{comment.split(`${postId}/0`)[1]}</h4>
                                    </div>
                                </Typography>
                            </Box>
                        ))}
                        <Divider sx={{background: `${mode=="light"?"gray":"aliceblue"}`}} />
                    </Box>
                </div>
            )}
        </div>
    );
}

export default Post;
