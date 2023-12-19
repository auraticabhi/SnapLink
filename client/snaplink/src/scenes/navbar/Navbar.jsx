import { IconButton, InputBase, Typography, Select, MenuItem, FormControl } from "@mui/material";
import { Search, DarkMode, LightMode } from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout } from '../../state';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const mode = useSelector((state) => state.mode);
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className={`flex justify-between items-center p-4 ${mode === "dark" ? "bg-slate-900 text-white" : "bg-white text-gray-800"} transition-colors duration-500`}>
      <div className="flex items-center space-x-4">
        <div
          className="font-bold text-2xl md:text-3xl cursor-pointer"
          onClick={() => {
            navigate("/home");
          }}
        >
          SnapLink
        </div>
        <div className={`hidden md:flex items-center ${mode === "dark" ? "bg-gray-800" : "bg-gray-200"} rounded-xl px-3 transition-colors duration-500`}>
          <input
            className={`bg-transparent focus:outline-none ${mode=="dark"?"text-gray-200":"text-gray-800"}`}
            type="text"
            placeholder="Search..."
          />
          <IconButton>
          <div className={`${mode === "dark" ? "text-gray-200" : "text-gray-800"}`} onClick={()=>{alert("Searching is currently Unawailable!")}}>
            <Search/>
            </div>
          </IconButton>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <IconButton onClick={() => { dispatch(setMode()) }}>
        <div className={`${mode === "dark" ? "text-gray-200" : "text-gray-800"}`}>
          {mode === "light" ? <DarkMode /> : <LightMode />}
          </div>
        </IconButton>
        <FormControl variant="standard" value={fullName}>
          <Select
            sx={{color:`${mode=="dark"?"aliceblue":"black"}`, padding: "7px", }}
            value={fullName}
            className={`${mode=="light"?"bg-gray-200":"bg-gray-700"} w-36 rounded px-1 py-2 transition-colors duration-500`}
            input={<InputBase />}
          >
            <MenuItem value={fullName}>
              <Typography sx={{fontWeight: "bold"}}>{fullName}</Typography>
            </MenuItem>
            <MenuItem onClick={() => { dispatch(setLogout()) }}>
            <Typography sx={{fontWeight: "bold"}}>LogOut</Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  )
}

export default Navbar;