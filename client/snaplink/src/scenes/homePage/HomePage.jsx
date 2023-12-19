import { Box } from '@mui/material';
import Navbar from '../navbar/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import UserWidget from '../../widgets/UserWidget';
import MyPostWidget from '../../widgets/MyPostWidget';
import PostWidget from '../../widgets/PostWidget';
import AdvertWidget from '../../widgets/AdvertWidget';
import FriendListWidget from '../../widgets/FriendListWidget';
import { setUserx } from '../../state';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

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

    const userId = localStorage.getItem('logindata') ?
        JSON.parse(localStorage.getItem('logindata')).user._id :
        null;
    const token = useSelector((state) => state.token);
    let [userr, setUserr] = useState(false);
    const dispatch = useDispatch();

    async function getUser() {
        try {
            const data = await axios.get(`https://snaplink-backend.onrender.com/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            //console.log(data.data);
            dispatch(setUserx({ user: data.data }));
            //console.log('heyyy');
            setUserr(true);
        } catch (err) {
            toast.error("Something went wrong");
            console.log(err.message);
        }
    }

    useEffect(() => {
        if (userId && user == null) {
            getUser();
        } else if (user != null) {
            setUserr(true);
        }
    }, []);

    return ( <
        div > {
            userId && !userr ? ( <
                >
                <
                Loading / >
                <
                />
            ) : ( <
                Box className = 'flex flex-grow flex-col' >
                <
                Navbar / >
                <
                Box className = { `w-full min-h-screen ${mode=="dark"?"bg-gray-950":"bg-gray-200"} transition-colors duration-500 px-6 py-2 block md:flex gap-3 justify-between` } >
                <
                Box className = "md:w-1/4 mt-6" >
                <
                UserWidget userId = { _id }
                picturePath = { picturePath }
                /> <
                /Box> <
                br className = '' / >
                <
                Box className = "md:w-1/2 md:mt-6" >
                <
                MyPostWidget picturePath = { picturePath }
                /> <
                br / >
                <
                PostWidget userId = { _id }
                /> <
                div className = 'md:mb-6' / >
                <
                /Box> <
                Box className = "hidden md:block w-1/4 ml-3" >
                <
                div className = 'mt-6' / >
                <
                AdvertWidget / >
                <
                Box className = "mt-4" / >
                <
                FriendListWidget userId = { _id }
                /> <
                /Box> <
                /Box> <
                /Box>
            )
        } <
        /div>
    );
}

export default HomePage;
