import { Box } from '@mui/material';
import Navbar from '../navbar/Navbar';
import { useSelector } from 'react-redux';
import UserWidget from '../../widgets/UserWidget';
import MyPostWidget from '../../widgets/MyPostWidget';
import PostWidget from '../../widgets/PostWidget';
import AdvertWidget from '../../widgets/AdvertWidget';
import FriendListWidget from '../../widgets/FriendListWidget';

function HomePage() {
    const user = useSelector((state) => state.user);
    let _id = null;
    let picturePath = null;
    if (user) {
        //console.log('kkl', user);
        _id = user._id;
        picturePath = user.picturePath;
    }

    const mode = useSelector((state) => state.mode)

    return ( 
        <div> 
        <Box className = 'flex flex-grow flex-col' >
          <Navbar/>
            <Box className = { `w-full min-h-screen ${mode=="dark"?"bg-gray-950":"bg-gray-200"} transition-colors duration-500 px-6 py-2 block md:flex gap-3 justify-between` } >
                <Box className = "md:w-1/4 mt-6">
                <UserWidget userId = { _id } picturePath = { picturePath }/> 
                </Box> 
                <br className = '' />
                <Box className = "md:w-1/2 md:mt-6">
                <MyPostWidget picturePath = { picturePath }/> 
                <br/>
                <PostWidget userId = { _id }/> 
                <div className = 'md:mb-6' />
                </Box> 
                <Box className = "hidden md:block w-1/4 ml-3" >
                <div className = 'mt-6' />
                <AdvertWidget />
                <Box className = "mt-4" />
                <FriendListWidget userId = { _id }/> 
                </Box> 
                </Box> 
            </Box>
        </div>
    );
}

export default HomePage;
