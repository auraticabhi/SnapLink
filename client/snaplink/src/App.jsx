import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './scenes/homePage/HomePage'
import LoginPage from './scenes/loginPage/LoginPage'
import ProfilePage from './scenes/profilePage/ProfilePage'
import { useSelector } from 'react-redux'

function App() {

    const location = useLocation();
    //console.log("logindt", localStorage.getItem("logindata"))

    const user = useSelector((state) => state.user);
    const userId = localStorage.getItem('logindata')
    ? JSON.parse(localStorage.getItem('logindata')).user._id
    : null;
    const token = useSelector((state) => state.token);
    let [userr, setUserr] = useState(false);
    const dispatch = useDispatch();

    async function getUser() {
    try{
    const data = await axios.get(`http://localhost:3001/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    //console.log(data.data);
    dispatch(setUserx({ user: data.data }));
    //console.log('heyyy');
    setUserr(true);
    }
    catch(err){
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
    
    const isLogin = useSelector((state) => {
        if (state.token) return true
        else return false;
    })

    return ( 
        <div>
        {
        !userr?(
            </Loading>
        ):(
        <div className = "app">
        <Routes>
        <Route path = "/" element = { < LoginPage / > }/> 
        <Route path = "/home" element = { isLogin ? ( < HomePage / > ) : ( < Navigate to = "/" / > ) }/> 
        <Route path = "/profile/:userId" element = { isLogin ? < ProfilePage key = { location.pathname } />:<Navigate to="/" />}/> 
        </Routes> 
        </div>
        )                                             
        }                                             
        </div>                                             
        )
    }

    export default App;
