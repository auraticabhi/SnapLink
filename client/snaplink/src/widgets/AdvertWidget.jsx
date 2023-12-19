import { Typography } from '@mui/material';
import ad from "../assets/ad.png";
import { useSelector } from 'react-redux';

function AdvertWidget() {

  const mode = useSelector((state)=>state.mode);
  return (
    <div className={`p-6 pb-5 ${mode === "dark" ? 'text-gray-200 bg-slate-900' : 'text-gray-800 bg-white'} rounded-lg transition-colors duration-500`}>
      <div className="flex justify-between items-center mb-4">
        <Typography className="font-medium text-lg"><div className='font-semibold'>Sponsored</div></Typography>
        <Typography onClick={()=>{alert("Currently UnAvailable!")}} className="text-blue-400 cursor-pointer"><div className='font-semibold'>Create Ad</div></Typography>
      </div>
      <img className="w-full rounded-md mb-4" alt="advert" src={ad} />
      <div className="flex justify-between items-center mb-2">
        <Typography className=""><div className={`${mode === "dark" ? 'text-gray-200' : 'text-gray-800'} font-semibold`}>MAC Cosmetics</div></Typography>
        <Typography className="text-blue-400"><div className='font-semibold'>maccosmetics.in</div></Typography>
      </div>
      <hr className='mb-2'/>
      <Typography className="text-blue-400">
        <div className='font-semibold'>Just a normal cosmetics Company</div>
      </Typography>
    </div>
  );
}

export default AdvertWidget;
