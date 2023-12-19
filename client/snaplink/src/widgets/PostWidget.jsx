import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../state';
import axios from 'axios';
import Loading from '../components/Loading';
import Post from './Post';
import toast from 'react-hot-toast';

function PostWidget({ userId, isProfile = false }) {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const mode = useSelector((state)=>state.mode);

  useEffect(() => {
    async function getPosts() {
      try{
      let { data } = await axios.get('https://snaplink-backend.onrender.com/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setPosts({ posts: data }));
    }
    catch(err){
      toast.error("Err Connecting...");
      console.log(err.message);
    }
    }

    async function getUserPosts() {
      try{
      const { data } = await axios.get(`https://snaplink-backend.onrender.com/posts/${userId}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setPosts({ posts: data }));
    }
    catch(err){
      toast.error("Err Connecting...");
      console.log(err.message);
    }
    }

    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [userId, isProfile, token, dispatch]);

  if (posts.length === 0) return <div className={`${mode === "dark" ? 'text-gray-200' : 'text-gray-800'} ml-1`} >No Posts Found</div>;

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      {posts.length > 0 ? (
        posts.map(({ _id, user, description, location, picturePath, likes, comments }) => (
          <Post
            key={_id}
            postId={_id}
            postUserId={user._id}
            name={`${user.firstName} ${user.lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={user.picturePath}
            likes={likes}
            comments={comments}
          />
        ))
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default PostWidget;
