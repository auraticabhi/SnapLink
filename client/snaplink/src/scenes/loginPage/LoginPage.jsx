import { Typography } from '@mui/material';
import Form from './Form';

function LoginPage() {
  const mode = 'dark';

  return (
    <div id="imggg" className={`flex flex-col h-screen ${mode === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-200 text-gray-800'} transition-colors duration-500`}>
      <div className={`w-full mb-4 ${mode === 'dark' ? 'bg-slate-900' : 'bg-white'} bg-opacity-80 px-4 py-3.5 text-center`}>
        <Typography variant='h4'>
          <div className="font-bold">SnapLink</div>
        </Typography>
      </div>

      <div id="srl" className={`md:w-10/12 w-11/12 p-6 mx-auto my-auto rounded-3xl overflow-auto ${mode === 'dark' ? 'bg-slate-900' : 'bg-white'} bg-opacity-60 shadow-md`}>
        <Typography variant="h5" className="font-medium text-blue-400 mb-5 text-center">
          <div className='font-semibold'>Welcome to SnapLink, the Social Media for Sociopaths!</div>
        </Typography>
        <Form />
      </div>
      <br/>
    </div>
  );
}

export default LoginPage;
