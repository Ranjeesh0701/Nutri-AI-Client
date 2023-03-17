import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react'
import { IoFastFoodSharp } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { auth, db } from '../../config/firebase';
import Navbar from '../components/Navbar'

const DietChange = ({user}:any) => {

    const [searchParams, setSearchParams] = useSearchParams();

    const [currentShare, setCurrentShare] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    const [loggedIn, setLoggedIn] = useState(false);

    const [loginActive, setLoginActive] = useState(false);

    const navigate = useNavigate();

    const redirectToDashboard = () => {
        navigate('/dashboard');
    }

    const [isOpen, setIsOpen] = useState(false);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if(!searchParams.get('share_id')) return;
        const shareId = searchParams.get('share_id');
        db.collection('shares').where('id','==',shareId).get().then((res) => {
            const data = res?.docs[0]?.data();
            setCurrentShare(data);
            setLoading(false);
        }).catch(err => {
            setCurrentShare(null);
            setLoading(false);
        })
    }, [searchParams])

    const changePlanConfirm = () => {
        if(!user && !auth.currentUser) {
            setIsOpen(true);
        }else {
            const userId = auth?.currentUser?.uid;
            if(!userId) return;
            setSaving(true);
            db.collection('dietplan').where('userId', '==', userId).get().then((res) => {
                const timestamp = new Date();
                if(res?.docs[0]?.id) {
                    console.log(res.docs[0].data());
                    res.docs[0].ref.update({
                        isCustomDiet: true,
                        nutrients: null,
                        meals: currentShare.sharedDiet,
                        createdAt: timestamp
                    }).then(() => {
                        db.collection('history').add({
                            userId,
                            meals: currentShare.sharedDiet,
                            createdAt: timestamp,
                            isCustomDiet: true,
                            id: res.docs[0].ref.id
                        }).then((res) => {
                            db.collection('shares').doc(currentShare.id).update({isUsed: true}).then((res) => {
                                setCurrentShare({...currentShare, isUsed: true});
                                setSaving(false);
                                navigate('/dashboard');
                            })
                            .catch((err) => {
                                console.log(err);
                                setSaving(false);
                            })
                        })
                        .catch((err) => {
                            setSaving(false);
                        })
                    }).catch((err) => {
                        console.log(err);
                        setSaving(false);
                    })
                }else {

                    const ref = db.collection('dietplan').doc();
                    const timestamp = new Date();
                    setSaving(true);
                    ref.set({
                        userId,
                        meals: currentShare.sharedDiet,
                        createdAt: timestamp,
                        isCustomDiet: true,
                        id: ref.id
                    }).then((res) => {
                        db.collection('history').add({
                            userId,
                            meals: currentShare.sharedDiet,
                            createdAt: timestamp,
                            isCustomDiet: true,
                            id: ref.id
                        }).then((res) => {
                            db.collection('shares').doc(currentShare.id).update({isUsed: true}).then((res) => {
                                setCurrentShare({...currentShare, isUsed: true});
                                setSaving(false);
                                navigate('/dashboard');
                            })
                            .catch((err) => {
                                console.log(err);
                                setSaving(false);
                            })
                        })
                        .catch((err) => {
                            setSaving(false);
                        })
                    }).catch(err => {
                        console.log(err);
                        setSaving(false);
                    })

                }

            }).catch((err) => {
                console.log(err);
            })

        }
    }

    // Login or Signup
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpUsername, setSignUpUsername] = useState('');

    const login = () => {
        if(!loginEmail || !loginPassword) {
            toast.error('Please fill all the field', {
                position: 'bottom-right',
                autoClose: 1000
            })
            return;
        }
        auth.signInWithEmailAndPassword(loginEmail, loginPassword).then(() => {
            const username:any = auth.currentUser?.displayName;
            toast.success('Login successfull', {
                position: 'bottom-right',
                autoClose: 1000
            })
            localStorage.setItem('user', username);
            setIsOpen(false);
        }).catch((error) => {
            toast.error('Something went wrong!', {
                position: 'bottom-right',
                autoClose: 1000
            });
            setIsOpen(false);
        })
    }

    const signUp = () => {
        if(!signUpEmail || !signUpPassword || !signUpUsername) {
            toast.error('Please fill all the field', {
                position: 'bottom-right',
                autoClose: 1000
            })
            return;
        }        
        auth.createUserWithEmailAndPassword(signUpEmail, signUpPassword).then((userCredential) => {
            const user = userCredential.user;
            auth?.currentUser?.updateProfile({
                displayName: signUpUsername
            }).then(() => {
                toast.success('Registration success', {
                    position: 'bottom-right',
                    autoClose: 1000
                })
                localStorage.setItem('user', signUpUsername);
                setIsOpen(false);
            }).catch((error) => {
                toast.error('Something went wrong!', {
                    position: 'bottom-right',
                    autoClose: 1000
                });
                setIsOpen(false);
            })
            console.log(user);
            
        }).catch((error) => {
            toast.error(error.message, {
                position: 'bottom-right',
                autoClose: 1000
            });
            setIsOpen(false);
        })
    }

    const rejectPlan = () => {
        if(!user && !auth.currentUser) {
            setIsOpen(true);
        }else {
            db.collection('shares').doc(currentShare.id).update({isRejected: true}).then((res) => {
                setCurrentShare({...currentShare, isRejected: true});
                navigate('/dashboard');
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

  return (
    <>
        <div className='min-h-screen'>
        <Navbar />
        <div className='flex items-center mx-auto pb-4 px-28 h-[calc(100vh-5rem)]'>
            {
                loading ? (
                                        
                    <div className="flex flex-col w-1/2 gap-5 p-2 mx-auto bg-white shadow-lg select-none sm:p-4 sm:h-64 rounded-2xl sm:flex-row ">
                        <div className="bg-gray-200 h-52 sm:h-full sm:w-72 rounded-xl animate-pulse">
                        </div>
                        <div className="flex flex-col flex-1 gap-5 sm:p-2">
                            <div className="flex flex-col flex-1 gap-3">
                                <div className="w-full bg-gray-200 animate-pulse h-14 rounded-2xl">
                                </div>
                                <div className="w-full h-3 bg-gray-200 animate-pulse rounded-2xl">
                                </div>
                                <div className="w-full h-3 bg-gray-200 animate-pulse rounded-2xl">
                                </div>
                                <div className="w-full h-3 bg-gray-200 animate-pulse rounded-2xl">
                                </div>
                                <div className="w-full h-3 bg-gray-200 animate-pulse rounded-2xl">
                                </div>
                            </div>
                            <div className="flex gap-3 mt-auto">
                                <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse">
                                </div>
                                <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse">
                                </div>
                                <div className="w-20 h-8 ml-auto bg-gray-200 rounded-full animate-pulse">
                                </div>
                            </div>
                        </div>
                    </div>
                )
                :
                (
                    <>
                        {
                            !currentShare ? (
                                <div className='flex-1 h-3/5 justify-center items-center text-center'>
                                    <div className='border flex flex-col items-center justify-center rounded-lg h-full shadow-2xl w-[55%] mx-auto'>
                                        <p>The link is broken.</p>
                                        <a href="/dashboard" className='bg-green-400 px-4 py-2 rounded-3xl font-semibold text-sm hover:bg-green-300 border border-slate-900 mt-4'>Go to dashboard</a>
                                    </div>
                                </div>
                            )
                            :
                            (
                                <>
                                    {
                                        currentShare.isRejected || currentShare.isUsed ? (
                                            <div className='flex-1 h-3/5 justify-center items-center text-center'>
                                                <div className='border flex flex-col items-center justify-center rounded-lg h-full shadow-2xl w-[55%] mx-auto'>
                                                    <p>The link is broken.</p>
                                                    <a href="/dashboard" className='bg-green-400 px-4 py-2 rounded-3xl font-semibold text-sm hover:bg-green-300 border border-slate-900 mt-4'>Go to dashboard</a>
                                                </div>
                                            </div>
                                        )
                                        :
                                        (
                                            <div className='flex-1 h-3/5 justify-center items-center text-center'>
                                                <p className='text-lg font-bold pb-4'>Do you want to use the diet plan from 19tuec201</p>
                                                {
                                                    !saving ? (
                                                        <div className='pb-4 flex justify-center gap-6'>
                                                            <button className='px-4 py-2 rounded-3xl font-semibold text-sm border border-slate-900' onClick={rejectPlan}>No</button>
                                                            <button className='bg-green-400 px-4 py-2 rounded-3xl font-semibold text-sm hover:bg-green-300 border border-slate-900' onClick={changePlanConfirm}>Yes</button>
                                                        </div>
                                                    )
                                                    :
                                                    (
                                                        <div className='flex items-center justify-center gap-4 pb-4'>
                                                            <div className="flex items-center justify-center">
                                                                <div
                                                                    className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                                    role="status">
                                                                    <span
                                                                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                                                    >Loading...</span
                                                                    >
                                                                </div>
                                                            </div>
                                                            Saving
                                                        </div>
                                                    )
                                                }
                                                <div className='border rounded-lg h-full shadow-2xl w-[55%] mx-auto flex flex-col justify-center'>
                                                    {
                                                        currentShare.sharedDiet && currentShare.sharedDiet.map((diet:any, index:any) => (
                                                            <div className='flex items-center justify-between py-2 px-6' key={index}>
                                                                <div key={index} className="flex items-center gap-5">
                                                                    <div>
                                                                        <IoFastFoodSharp className='text-green-700' size={24} />
                                                                    </div>
                                                                    <div><p className='text-[#1c1c1c] font-bold py-2'>{diet.name}</p></div>
                                                                </div>
                                                                <div>
                                                                    <input type="time" value={diet.time} disabled={true} className="text-[#1c1c1c] pl-2 py-2 rounded-lg" />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }
                    </>
                )
            }
        </div>
    </div>
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        {
                            loginActive ? (
                                <div className='py-4'>
                                    <input type="text" placeholder='Enter email' className='w-full border outline-none px-4 py-2 rounded' value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                                    <input type="password" placeholder='Enter password' className='w-full border outline-none px-4 py-2 rounded mt-3' value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} /><br />
                                    <button className='bg-green-400 px-4 py-2 rounded-3xl font-semibold text-sm hover:bg-green-300 border border-slate-900 mx-auto my-3' onClick={login}>Login</button>
                                    <p className='text-sm'>Don't have and account? <span className='cursor-pointer text-blue-800 hover:text-blue-900' onClick={() => setLoginActive(false)}>Sign Up</span></p>
                                </div>
                            )
                            :
                            (
                                <div className='py-4'>
                                    <input type="text" placeholder='Enter username' className='w-full border outline-none px-4 py-2 rounded' value={signUpUsername} onChange={(e) => setSignUpUsername(e.target.value)} />
                                    <input type="email" placeholder='Enter email' className='w-full border outline-none px-4 py-2 rounded mt-3' value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />
                                    <input type="password" placeholder='Enter password' className='w-full border outline-none px-4 py-2 rounded mt-3' value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} /><br />
                                    <button className='bg-green-400 px-4 py-2 rounded-3xl font-semibold text-sm hover:bg-green-300 border border-slate-900 mx-auto my-3' onClick={signUp}>Sign Up</button>
                                    <p className='text-sm'>Already have an account? <span className='cursor-pointer text-blue-800 hover:text-blue-900' onClick={() => setLoginActive(true)}>Log In</span></p>
                                </div>
                            )
                        }
                    </div>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition.Root>
        <ToastContainer />
    </>
  )
}

export default DietChange