import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './scenes/homePage/HomePage'
import LoginPage from './scenes/loginPage/LoginPage'
import ProfilePage from './scenes/profilePage/ProfilePage'
import { useSelector, useDispatch } from 'react-redux'
import { setUserx } from './state'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import Loading from './components/Loading'

function App() {
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const userId = localStorage.getItem('logindata')
    ? JSON.parse(localStorage.getItem('logindata')).user._id
    : null;
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  async function getUser() {
    try {
      const { data } = await axios.get(`https://snaplink-backend.onrender.com/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setUserx({ user: data }));
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId && user === null) {
      getUser();
    } else {
      setLoading(false);
    }
  }, [userId, user]);

  const isLogin = useSelector((state) => !!state.token);

  return (
    <div>
      <div className="app">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              isLogin ? (
                loading ? (
                  <Loading />
                ) : (
                  <HomePage />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile/:userId"
            element={
              isLogin ? (
                loading ? (
                  <Loading />
                ) : (
                  <ProfilePage key={location.pathname} />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
