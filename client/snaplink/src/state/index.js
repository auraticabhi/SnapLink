import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    mode: localStorage.getItem("mode") ? localStorage.getItem("mode") : "dark",
    user: null,
    token: localStorage.getItem("logindata") ? JSON.parse(localStorage.getItem("logindata")).token : null,
    change: true,
    posts: []
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
            localStorage.setItem("mode", state.mode);
        },
        setChange: (state) => {
            state.change = !state.change;
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setUserx: (state, action) => {
            console.log("tt ", action.payload);
            state.user = action.payload.user;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("logindata")
        },
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.log("User not Found");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) return action.payload.post;
                else return post;
            })
            state.posts = updatedPosts;
        }
    }
})

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setUserx, setChange } = authSlice.actions;
export default authSlice.reducer;