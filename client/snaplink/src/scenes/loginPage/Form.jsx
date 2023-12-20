import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../state';
import axios from 'axios';
import toast from 'react-hot-toast';

const Form = () => {
  const [pageType, setPageType] = useState('login');
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const registerHandle = async (formData) => {
    const ld = toast.loading("Loading...");
    const fdata = new FormData();
    for (let data in formData) {
      fdata.append(data, formData[data]);
    }
    if (image) {
      fdata.append('picture', image);
    }

    let registerRes = null;
    try {
      registerRes = await axios.post('https://snaplink-backend.onrender.com/auth/register', fdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      alert('Email already registered');
      toast.dismiss(ld);
      return;
    }
    reset();
    toast.dismiss(ld);
    if (registerRes) {
      setPageType('login');
    }
    toast.success("Sucessfully Registered, Please Login...")
  };

  const loginHandle = async (formData) => {
    const ld = toast.loading("Loading...");
    let loginRes = null;
    try {
      loginRes = await axios.post('https://snaplink-backend.onrender.com/auth/login', formData);
    } catch (err) {
      alert("Password is incorrect or user doesn't exist");
      toast.dismiss(ld);
      return;
    }
    reset();
    if (loginRes) {
      dispatch(
        setLogin({
          user: loginRes.data.user,
          token: loginRes.data.token,
        })
      );
      navigate('/home');
      const storedata = {
        token: loginRes.data.token,
        user: loginRes.data.user,
        ttl: Date.now() + 72 * 60 * 60 * 1000,
      };
      localStorage.setItem('logindata', JSON.stringify(storedata));
      toast.dismiss(ld);
      toast.success("Login Sucessful");
    }
  };

  /*Temporary*/
  const loginGuest = async () => {
    loginHandle({email: "demoxsnap@snaplink.com", password: "12345"})
  };

  return (
    <div className="px-4 py-4">
      <div className="text-center bg-gray-700 text-black bg-opacity-60 mb-4 md:mx-auto max-w-xs rounded-lg">
      <div>
        <Button onClick={() => setPageType('register')}><div className='text-white hover:text-blue-300'>Register</div></Button>
        <Button onClick={() => setPageType('login')}><div className='text-white hover:text-blue-300'>Login</div></Button>
        </div>
        <hr/>
        <div className='text-blue-400 py-1 hover:text-blue-300 cursor-pointer' onClick={()=>loginGuest()}>
          Try without an Account
        </div>
      </div>
      {pageType === 'register' ? (
        <form onSubmit={handleSubmit(registerHandle)} className="flex flex-col gap-4">
        <label htmlFor="firstname" className='font-semibold' >FirstName</label>
                <input className="rounded bg-gray-700 bg-opacity-50"  id="firstname" {...register('firstName', {required: true})}/>
                {errors.firstName && <p>FirstName is required</p>}
                {"   "}
                <label htmlFor="lastname" className='font-semibold' >lastName</label>
                <input className='rounded bg-gray-700 bg-opacity-50' {...register('lastName', {required: true})} type="text" id="lanme" />
                {errors.lastName && <p>lastName is required</p>}
          
                <label htmlFor="email" className='font-semibold' >Email</label>
                <input id="email" className='rounded bg-gray-700 bg-opacity-50' {...register('email', {required: true}, {pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ })}/>
                {errors.email && <p>Email is required</p>}
              
                <label htmlFor="password" className='font-semibold' >Password</label>
                <input id="password" className='rounded bg-gray-700 bg-opacity-50' {...register('password', {required: true})}/>
                {errors.password && <p>Password is required</p>}
          
                <label htmlFor="location" className='font-semibold' >Location</label>
                <input id="location" className='rounded bg-gray-700 bg-opacity-50' {...register('location')}/>
                <label htmlFor="occp" className='font-semibold' >Occupation</label>
                <input id="occp" className='rounded bg-gray-700 bg-opacity-50' {...register('occupation')}/>
                <label htmlFor="pic" className='font-semibold' >Profile Pic...</label>
          <input type="file" id="pic" className='rounded' onChange={(e) => setImage(e.target.files[0])} />
          <Button className="bg-blue-500 text-white py-2 rounded-md" type="submit">
          <div className='text-white hover:text-blue-300 font-semibold'>
            Register
            </div>
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(loginHandle)} className="flex flex-col gap-4">
        <label htmlFor="email" className='font-semibold' >Email</label>
                <input id="email" className='rounded bg-gray-700 bg-opacity-50' {...register('email', {required: true}, {pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ })}/>
                {errors.email && <p>Email is required</p>}
                <label htmlFor="password" className='font-semibold' >Password</label>
                <input id="password" className='rounded bg-gray-700 bg-opacity-50' {...register('password', {required: true})}/>
                {errors.password && <p>Password is required</p>}
          <Button className="py-2 rounded-md" type="submit">
          <div className='text-white hover:text-blue-300 font-semibold'>
            Login
            </div>
          </Button>
        </form>
      )}
    </div>
  );
};

export default Form;
