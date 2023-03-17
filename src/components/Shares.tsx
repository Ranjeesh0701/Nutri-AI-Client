import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai';
import { FaPlus, FaShare, FaShareAlt, FaUser } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { auth, db } from '../../config/firebase';
import emailjs from '@emailjs/browser'

const Shares = ({shareDiet, setShareDiet, updateShareFoodName, updateShareMealTime, deleteShareMeal,addShareMealField}:any) => {

    const [isOpen, setIsOpen] = useState(false);
    const [sendTo,setSendTo]  = useState<any>('');
    const [note, setNote] = useState('');
    const [mailing, setMailing] = useState(false);
    const [shareModal, setShareModal] = useState(false);

    const [userShares, setUserShares] = useState<any>([]);
    const [userSharesLoading, setUserSharesLoading] = useState<boolean>(true);

    useEffect(() => {
        db.collection('shares').where('sentBy', '==', auth?.currentUser?.uid).get().then((res) => {
            var data:any = []
            res.docs.map(doc => {
                data.push(doc.data());
            })
            setUserShares(data);
            setUserSharesLoading(false);
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    const shareMail = async () => {
        if(sendTo.length <= 0 || !sendTo.includes("@") || !sendTo.includes(".")){
            toast.error('Provide a valid email!', {
                position: 'bottom-right',
                autoClose: 1000
            });
            return;
        };

        const shareRef = db.collection('shares').doc();
        setMailing(true);
        shareRef.set({
            note,
            sendTo: sendTo,
            sentBy: auth.currentUser?.uid,
            sharedDiet: shareDiet,
            id: shareRef.id,
            isUsed: false,
            isRejected: false,
        }).then((res:any) => {

            emailjs.send('service_cpd7njp', 'template_o9f362b', {
                message: note,
                from_name: auth.currentUser?.displayName,
                to_name: sendTo.split("@")[0],
                link: `http://localhost:5173/user/change/diet?share_id=${shareRef.id}`,
                to_mail: sendTo,
                reply_to: auth.currentUser?.email
            }, '8WFMkc8hmx5o1T6t4')
            .then((result:any) => {
                console.log(result.text);
                toast.success('Mail sent successfully', {
                    position: 'bottom-right',
                    autoClose: 1000
                })
                setShareDiet([{
                    id: 0,
                    name: '',
                    time: ''
                }]);
                setShareModal(false);
                setMailing(false);
            }, (error:any) => {
                console.log(error.text);
                setShareModal(false);
                toast.error('Mail not sent!', {
                    position: 'bottom-right',
                    autoClose: 1000
                });
            });
            
        }).catch(err => {
            console.log(err);
            toast.error('Something went wrong!', {
                position: 'bottom-right',
                autoClose: 1000
            });
        })        
    }

  return (
    <>
        <div className="min-h-[calc(100vh-5rem)] bg-[#023430]">
            <div className='flex'>
                <div className='w-full px-6'>
                    <div className='bg-opacity-25 bg-black px-5 my-5 py-5 rounded-lg'>
                        {
                            shareDiet && shareDiet.map((diet:any, index:any) => (
                                <div className={`${index > 0 ? 'pt-4': ''} flex items-center gap-6`} key={index}>
                                    <div className='w-full flex flex-col'>
                                        <label htmlFor="food-name" className='text-white'>Food name</label>
                                        <input type="text" id="food-name" placeholder='Food...' className='px-3 py-2 rounded-lg' value={diet.name} onChange={(e) => updateShareFoodName(e.target.value, diet.id)} />
                                    </div>
                                    <div className='flex flex-col w-2/6'>
                                        <label htmlFor="food-time" className='text-white'>Time</label>
                                        <input type="time" id="food-time" className='px-4 py-2 rounded-lg' onChange={(e) => updateShareMealTime(e.target.value, diet.id)} />
                                    </div>
                                    {
                                        shareDiet.length > 1 && (
                                            <div>
                                                <AiFillDelete className='text-red-600 cursor-pointer my-auto' onClick={() => deleteShareMeal(diet.id)} />
                                            </div>
                                        )
                                    }
                                </div>
                            ))
                        }
                        <div className='mt-4 flex items-center gap-4'>
                            <button className='border border-[#023430] text-white flex items-center gap-6 py-2 rounded-lg px-4 text-sm font-bold w-6/12' onClick={addShareMealField}><FaPlus />Add Meal</button>
                            <button className='bg-[#023430] hover:bg-[#02343081] text-white flex items-center gap-6 py-2 rounded-lg px-4 text-sm font-bold w-full my-4' onClick={() => {
                                if(shareDiet.filter((diet:any) => diet.name !== '').length > 0)
                                    setShareModal(true);
                                else
                                    toast.error('Please fill all the diet plan fields', {
                                        position: 'bottom-right',
                                        autoClose: 1000
                                    })
                            }}>Share Diet</button>
                        </div>
                        <div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <p className='text-white font-bold text-md pb-4'>Shares History</p>
                        </div>
                        {
                            userSharesLoading ? (
                                <div className='w-full bg-white px-4 py-3 rounded-lg'>
                                    <p className='font-bold'>Loading...</p>
                                </div>
                            )
                            :
                            (
                                <>
                                    {
                                        !userSharesLoading && userShares.length > 0 ? (
                                            <div>
                                                {
                                                    userShares.map((userShare:any, index:any) => (
                                                        <div className='w-full bg-opacity-25 bg-black rounded-lg px-4 py-4 flex justify-between' key={index}>
                                                            <div className='flex items-center gap-4'>
                                                                <div>
                                                                    <FaUser color="white" />
                                                                </div>
                                                                <p className='text-white'>{userShare.sendTo}</p>
                                                            </div>
                                                            <div>
                                                                {
                                                                    userShare?.sharedDiet?.map((meal:any, index:any) => (
                                                                        <div className='flex items-center justify-between gap-4' key={index}>
                                                                            <div>
                                                                                <p className='text-white'>{meal.name}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className='text-white'>{meal.time}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                        :
                                        (
                                            <div className='w-full bg-white px-4 py-3 rounded-lg'>
                                                <p className='font-bold'>No shares yet...</p>
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
        <Transition.Root show={shareModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setShareModal}>
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
                        <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                            <FaShare className='text-green-600' />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            Share diet plan
                            </Dialog.Title>
                            <div className='py-2'>
                                {/* <MultipleValueTextInput
                                    onItemAdded={(item:any, allItems:any) => setAllEmails(allItems)}
                                    onItemDeleted={(item:any, allItems:any) => setAllEmails(allItems)}
                                    label="Share to"
                                    name="item-input"
                                    placeholder="Enter email you want to share; separate them with COMMA or ENTER."
                                    style={{fontSize: '12px', border: '1px solid #ccc', outline: 'none', padding: '6px 10px', borderRadius: '4px'}}
                                /> */}
                                <input type="email" className='w-full border outline-none px-2 py-2 rounded-md mt-2 text-xs' placeholder='Send to...' value={sendTo} onChange={(e) => setSendTo(e.target.value)}>
                                </input>
                            </div>
                            <div>
                                <input type="text" className='w-full border outline-none px-2 py-2 rounded-md my-2 text-xs' placeholder='Add a note...' value={note} onChange={(e) => setNote(e.target.value)} />
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        {
                            !mailing ? (
                                <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => shareMail()}
                                >
                                    Share diet plan
                                </button>
                            )
                            :
                            (
                                <button
                                disabled
                                type="button"
                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    <div className='flex items-center gap-4'>
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
                                        Sharing
                                    </div>
                                </button>
                            )
                        }
                        <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setShareModal(false)}
                        >
                        Cancel
                        </button>
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

export default Shares