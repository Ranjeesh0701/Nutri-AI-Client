import { useState } from 'react';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';

import {useNavigate} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { auth } from '../../config/firebase';

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {
        auth.signInWithEmailAndPassword(email, password).then(() => {
            const username:any = auth.currentUser?.displayName;
            toast.success('Login successfull', {
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
    }
    
    const redirectToRegister = () => {
        navigate("/users/sign_up")
    }

  return (
    <>
        <div className="min-h-screen bg-[#023430]">
            <div className='container mx-auto min-h-screen'>
                <div className='flex items-center justify-center min-h-screen'>
                    <div className='bg-white px-10 py-10 rounded-md lg:w-[30%]'>
                        <div className='text-center'>
                            <h4 className='font-extrabold text-2xl'>Login</h4>
                            <p className='py-3 text-sm pb-7 mx-auto px-10'>Hey, Enter your details to get sign in your account</p>
                        </div>

                        <div className='flex-row'>
                            <input type="text" placeholder='Enter Email / Phone No' className='w-[100%] border px-3 py-2 mt-4 rounded text-sm' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <br />
                            <input type="text" placeholder='Passcode' className='w-[100%] border px-3 py-2 mt-4 rounded text-sm' value={password} onChange={(e) => setPassword(e.target.value)} />

                            <div className='pt-6 pb-3'>
                                <p className='text-xs cursor-pointer'>Having trouble in sign in?</p>
                            </div>
                            <div className="pt-6 pb-3">
                                <button className="w-[100%] px-4 py-3 bg-green-400 rounded-md text-sm font-bold text-gray-900" onClick={login}>Sign in</button>
                            </div>
                            <div className='w-[100%] text-center'>
                                <p className="py-5 text-xs">Or Sign in with</p>
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
                                <p className='text-xs'>Don't have an account? <span className='font-bold cursor-pointer' onClick={redirectToRegister}>Register now</span></p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ToastContainer />
    </>
  )
}

export default Login