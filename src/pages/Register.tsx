import React, { useState } from 'react'

import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';

import {useNavigate} from 'react-router-dom';

import { auth } from '../../config/firebase';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {

    const navigate = useNavigate();
    
    const redirectToLogin = () => {
        navigate("/users/sign_in")
    }

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerWithCredentials = () => {
        auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
            const user = userCredential.user;
            auth?.currentUser?.updateProfile({
                displayName: username
            }).then(() => {
                toast.success('Registration success', {
                    position: 'bottom-right',
                    autoClose: 1000
                })
                localStorage.setItem('user', username);
            }).catch((error) => {
                toast.error('Something went wrong!', {
                    position: 'bottom-right',
                    autoClose: 1000
                });
            })
            console.log(user);
            
        }).catch((error) => {
            toast.error(error.message, {
                position: 'bottom-right',
                autoClose: 1000
            });
        })
    }


  return (
    <div className="min-h-screen bg-[#023430]">
        <div className='container mx-auto min-h-screen'>
            <div className='flex items-center justify-center min-h-screen'>
                <div className='bg-white px-10 py-10 rounded-md lg:w-[30%]'>
                    <div className='text-center'>
                        <h4 className='font-extrabold text-2xl'>Register</h4>
                        <p className='py-3 text-sm pb-7 mx-auto px-10'>Hey, Enter your details to get sign up your account</p>
                    </div>

                    <div className='flex-row'>
                        <input type="text" placeholder='Enter Username' className='w-[100%] border px-3 py-2 rounded text-sm' onChange={(e) => setUsername(e.target.value)} />
                        <br />
                        <input type="email" placeholder='Enter Email' className='w-[100%] border px-3 py-2 mt-4 rounded text-sm' onChange={(e) => setEmail(e.target.value)} />
                        <br />
                        <input type="password" placeholder='Passcode' className='w-[100%] border px-3 py-2 mt-4 rounded text-sm' onChange={(e) => setPassword(e.target.value)} />

                        <div className='pt-6 pb-3'>
                            <p className='text-xs cursor-pointer'>Having trouble in sign up?</p>
                        </div>
                        <div className="pt-6 pb-3">
                            <button className="w-[100%] px-4 py-3 bg-green-400 rounded-md text-sm font-bold text-gray-900" onClick={registerWithCredentials}>Sign up</button>
                        </div>
                        <div className='w-[100%] text-center'>
                            <p className="py-5 text-xs">Or Sign up with</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2 border px-2 py-1 rounded-lg cursor-pointer'>
                                <FaGoogle />  
                                <p className='text-sm'>Google</p>                              
                            </div>
                            <div className='flex items-center gap-2 border px-2 py-1 rounded-lg cursor-pointer'>
                                <FaFacebook />
                                <p className='text-sm'>Facebook</p>
                            </div>
                            <div className='flex items-center gap-2 border px-2 py-1 rounded-lg cursor-pointer'>
                                <FaApple />
                                <p className='text-sm'>Apple Id</p>
                            </div>
                        </div>

                        <div className='pt-6 text-center'>
                            <p className='text-xs'>Already have an account? <span className='font-bold cursor-pointer' onClick={redirectToLogin}>Login now</span></p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <ToastContainer />
    </div>
  )
}

export default Register