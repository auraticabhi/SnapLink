import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './scenes/homePage/HomePage'
import LoginPage from './scenes/loginPage/LoginPage'
import ProfilePage from './scenes/profilePage/ProfilePage'
import { useSelector } from 'react-redux'

function App() {

    const location = useLocation();
    console.log("logindt", localStorage.getItem("logindata"))
    const isLogin = useSelector((state) => {
        if (state.token) return true
        else return false;
    })

    return ( 
        <div className = "app">
        <Routes>
        <Route path = "/" element = { < LoginPage / > }/> 
        <Route path = "/home" element = { isLogin ? ( < HomePage / > ) : ( < Navigate to = "/" / > ) }/> 
        <Route path = "/profile/:userId" element = { isLogin ? < ProfilePage key = { location.pathname } />:<Navigate to="/" />}/> 
        </Routes> 
        </div>
        )
    }

    export default App;