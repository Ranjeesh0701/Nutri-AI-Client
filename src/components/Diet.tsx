import React, { Fragment, useState } from 'react'
import {SiFoodpanda} from 'react-icons/si'
import {IoFastFoodOutline} from 'react-icons/io5'
import {MdEmojiFoodBeverage} from 'react-icons/md'
import axios from 'axios'
import { FaPlus, FaRemoveFormat } from 'react-icons/fa'
import {AiFillDelete} from 'react-icons/ai'
import { Dialog, Transition } from '@headlessui/react'
// import MultipleValueTextInput from 'react-multivalue-text-input';
import { auth, db } from '../../config/firebase'
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';

const Diet = ({timeFrame, setTimeFrame, calorie, setCalorie,glutenFree, setGlutenFree, vegetarian, setVegetarian, ketogenic, setKetogenic, currentMeal, setCurrentMeal, selectedMeal, setSelectedMeal, customPlan, setCustomPlan, customDiet, setCustomDiet, createDietPlan, addCustomMealField, deleteCustomMeal, updateValue, updateCustomMealTime, saveCustomPlan, dietLoading, savedDiet, changePlan, saveSuggestedPlan,shareUnSavedDiet, shareModal, setShareModal, setChangePlanOpen, changePlanOpen, changePlanLoading}:any) => {
    

    const [isOpen, setIsOpen] = useState(false);
    const [sendTo,setSendTo]  = useState<any>('');
    const [note, setNote] = useState('');
    const [mailing, setMailing] = useState(false);

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
            sharedDiet: customPlan && customDiet
        }).then((res) => {

            emailjs.send('service_cpd7njp', 'template_o9f362b', {
                message: note,
                from_name: auth.currentUser?.displayName,
                to_name: sendTo.split("@")[0],
                link: 'abcd'
            }, '8WFMkc8hmx5o1T6t4')
            .then((result:any) => {
                console.log(result.text);
                toast.success('Mail sent successfully', {
                    position: 'bottom-right',
                    autoClose: 1000
                })
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
            {
                !dietLoading ? (
                    <>
                        {
                            savedDiet ? (
                                <>
                                    {
                                        savedDiet.isCustomDiet === true ? (
                                            <div className='py-4 pt-10 px-10'>
                                                <p className='pb-6 text-white font-bold'>Current Plan<button className='bg-green-400 px-2 py-2 rounded-lg text-xs ml-4 text-black' onClick={() => setChangePlanOpen(true)}>Change plan</button></p>
                                                
                                                {
                                                    savedDiet && savedDiet.meals.map((diet:any, index:any) => (
                                                        <div className={`${index > 0 ? 'pt-4': ''} flex items-center gap-6`} key={index}>
                                                            <input type="text" placeholder='Food...' className='px-3 py-2 rounded-lg w-full' value={diet.name} onChange={(e) => updateValue(e.target.value, diet.id)} disabled={true} />
                                                            <input type="time" className='px-4 py-2 rounded-lg w-2/6' value={diet.time} onChange={(e) => updateCustomMealTime(e.target.value, diet.id)} disabled={true} />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                        :
                                        (
                                            <div className='py-4 pt-10 px-10'>
                                                <p className='pb-6 text-white font-bold'>Current Plan<button className='bg-green-400 px-2 py-2 rounded-lg text-xs ml-4 text-black' onClick={() => setChangePlanOpen(true)}>Change plan</button></p>
                                                
                                                {
                                                    savedDiet && savedDiet.meals.map((diet:any, index:any) => (
                                                       <>
                                                            <div className={`${index > 0 ? 'pt-4': ''} flex items-center gap-6`} key={index}>
                                                                <div>
                                                                    <img src={`https://webknox.com/recipeImages/${diet.id}-556x370.jpg`} alt="" width={50} height={50} className="rounded-full" />
                                                                </div>
                                                                <div>
                                                                    <p className='text-white'>{diet.title}</p>
                                                                </div>
                                                            </div>
                                                       </>
                                                    ))
                                                }
                                                {
                                                    savedDiet && savedDiet.meals.length > 0 && savedDiet.nutrients && (
                                                        <div className='pt-4'>
                                                            <p className='text-white font-bold'>Stats</p>
                                                            <div className='pt-4'>
                                                                <table className='w-full'>
                                                                    <thead>
                                                                    <td className='border text-white py-2 text-center'>Calories</td>
                                                                    <td className='border text-white py-2 text-center'>Carbohydrates</td>
                                                                    <td className='border text-white py-2 text-center'>Fat</td>
                                                                    <td className='border text-white py-2 text-center'>protein</td>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td className='border text-white text-center py-2'>{savedDiet.nutrients.calories}</td>
                                                                            <td className='border text-white text-center py-2'>{savedDiet.nutrients.carbohydrates}</td>
                                                                            <td className='border text-white text-center py-2'>{savedDiet.nutrients.fat}</td>
                                                                            <td className='border text-white text-center py-2'>{savedDiet.nutrients.protein}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </>
                            )
                            :
                            (
                                <div className='flex'>
                                    {
                                        customPlan ? (
                                            <div className='w-8/12 pl-6'>
                                                <div className='bg-opacity-25 bg-black px-5 my-5 py-5 rounded-lg'>
                                                    {
                                                        customDiet && customDiet.map((diet:any, index:any) => (
                                                            <div className={`${index > 0 ? 'pt-4': ''} flex items-center gap-6`} key={index}>
                                                                <div className='w-full flex flex-col'>
                                                                    <label htmlFor="food-name" className='text-white'>Food name</label>
                                                                    <input type="text" id="food-name" placeholder='Food...' className='px-3 py-2 rounded-lg' value={diet.name} onChange={(e) => updateValue(e.target.value, diet.id)} />
                                                                </div>
                                                                <div className='flex flex-col w-2/6'>
                                                                    <label htmlFor="food-time" className='text-white'>Time</label>
                                                                    <input type="time" id="food-time" className='px-4 py-2 rounded-lg' onChange={(e) => updateCustomMealTime(e.target.value, diet.id)} />
                                                                </div>
                                                                {
                                                                    customDiet.length > 1 && (
                                                                        <div>
                                                                            <AiFillDelete className='text-red-600 cursor-pointer my-auto' onClick={() => deleteCustomMeal(diet.id)} />
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                    <div className='mt-4 flex items-center gap-4'>
                                                        <button className='border border-[#023430] text-white flex items-center gap-6 py-2 rounded-lg px-4 text-sm font-bold w-6/12' onClick={addCustomMealField}><FaPlus />Add Meal</button>
                                                        <button className='bg-[#023430] hover:bg-[#02343081] text-white flex items-center gap-6 py-2 rounded-lg px-4 text-sm font-bold w-6/12' onClick={saveCustomPlan}>Create Diet</button>
                                                    </div>
                                                    <div>
                                                        <button className='bg-[#023430] hover:bg-[#02343081] text-white flex items-center gap-6 py-2 rounded-lg px-4 text-sm font-bold w-full my-4' onClick={() => {
                                                            if(customPlan && customDiet.filter((diet:any) => diet.name !== '').length > 0)
                                                                setShareModal(true);
                                                            else
                                                                toast.error('Please fill all the diet plan fields', {
                                                                    position: 'bottom-right',
                                                                    autoClose: 1000
                                                                })
                                                        }}>Share Diet</button>
                                                    </div>
                                                </div>
                                                <div>
                                                    
                                                </div>
                                            </div>
                                        )
                                        :
                                        (
                                            <div className='w-8/12 pl-6'>
                                                <div className='bg-opacity-25 bg-black px-5 my-5 py-5 rounded-lg'> 
                                                <div className='flex gap-8'>
                                                <div className='w-6/12'>
                                                    <label htmlFor="time-frame" className='text-white'>Select a time frame</label>
                                                    <select name="" id="time-frame" className='w-full px-4 py-2 rounded-lg' value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
                                                        <option value="day">Day</option>
                                                        <option value="week">Week</option>
                                                    </select>
                                                </div>
                                                <div className='w-6/12'>
                                                    <label htmlFor="target-calorie" className='text-white'>Target calorie for a day</label>
                                                    <input type="number" id="target-calorie" placeholder='Ex: 100' className='w-full px-4 py-2 rounded-lg' value={calorie} onChange={(e) => setCalorie(e.target.value)} />
                                                </div>
                                                </div>
                                                <div className='mt-8'>
                                                    <button className='bg-[#023430] rounded-lg px-4 py-2 hover:bg-[#02343081] w-full font-bold text-white' onClick={createDietPlan}>{
                                                        !currentMeal ? 'Get Diet plan' : 'Regenerate'
                                                    }</button>
                                                </div>
                                                </div>
                                                {
                                                    currentMeal && (
                                                        <div className='bg-opacity-25 bg-black px-5 my-5 py-5 rounded-lg'>
                                                            <div>
                                                                {
                                                                    currentMeal.meals.map((meal:any, index:any) => (
                                                                        <div key={index}>
                                                                            <div className='flex items-center gap-6 mb-4'>
                                                                                <div className='w-10 h-10'>
                                                                                    <img src={`https://webknox.com/recipeImages/${meal.id}-556x370.jpg`} className="rounded-full w-full h-full" alt="" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className='text-white text-sm'>{meal.title}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                            <div className='flex gap-6 items-center justify-between'>
                                                                <button className='w-full mx-auto bg-white py-2 rounded-lg font-bold' onClick={() => saveSuggestedPlan()}>Select plan</button>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                    <div className='w-4/12 px-6'>
                                        
                                        <div className='bg-opacity-25 bg-black px-5 my-5 py-5 rounded-lg'>
                                            <h3 className="mb-5 text-md font-bold text-white dark:text-white ">Choose diet:</h3>
                                            <ul className="w-full flex flex-col gap-6">
                                                <li onClick={() => setGlutenFree(!glutenFree)}>
                                                    <input type="checkbox" id="react-option" value="" className="hidden peer" disabled={customPlan} />
                                                    <label htmlFor="react-option" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                                        <div className="block">
                                                            <MdEmojiFoodBeverage className='text-blue-400 w-6 h-6 pb-1' />
                                                            <div className="w-full text-md font-semibold">Gluten Free</div>
                                                        </div>
                                                    </label>
                                                </li>
                                                <li onClick={() => setKetogenic(!ketogenic)}>
                                                    <input type="checkbox" id="flowbite-option" value="" className="hidden peer" disabled={customPlan} />
                                                    <label htmlFor="flowbite-option" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                                        <div className="block">
                                                            <IoFastFoodOutline className='text-red-400 w-6 h-6 pb-1' />
                                                            <div className="w-full text-md font-semibold">Ketogenic</div>
                                                        </div>
                                                    </label>
                                                </li>
                                                <li onClick={() => setVegetarian(!vegetarian)}>
                                                    <input type="checkbox" id="angular-option" value="" className="hidden peer" disabled={customPlan} />
                                                    <label htmlFor="angular-option" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                                        <div className="block">
                                                            <SiFoodpanda className='text-green-400 w-6 h-6 pb-1' />
                                                            <div className="w-full text-md font-semibold">Vegetarian</div>
                                                        </div>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className='bg-opacity-25 bg-black px-5 my-5 py-5 rounded-lg'>
                                            {
                                                customPlan ? (
                                                    <button className='bg-white w-full px-2 py-2 rounded-lg font-bold' onClick={() => setCustomPlan(false)}>Get suggested plan</button>
                                                )
                                                :
                                                (
                                                    <button className='bg-white w-full px-2 py-2 rounded-lg font-bold' onClick={() => setCustomPlan(true)}>Create a custom plan</button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </>
                )
                :
                (
                    <>
                        <div className='px-4 py-4'>
                            <div className='bg-white w-full py-2 px-4 rounded-lg'>
                                <p className='font-bold'>Loading...</p>
                            </div>  
                        </div>
                    </>
                )
            }
        </div>
        <Transition.Root show={changePlanOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setChangePlanOpen}>
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
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <AiFillDelete className='text-red-600' />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            Change plan
                            </Dialog.Title>
                            <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete the current diet plan and create a new diet plan?
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    {
                            changePlanLoading ? (
                                <button
                                type="button"
                                className="inline-flex items-center gap-3 w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                disabled
                                >
                                    <div className="flex items-center justify-center">
                                        <div
                                            className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                            role="status">
                                        </div>
                                    </div>
                                    <p>Changing</p>
                                </button>
                            )
                            :
                            (
                                <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => changePlan()}
                                >
                                Change plan
                                </button>
                            )
                        }
                        <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setChangePlanOpen(false)}
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
                            <AiFillDelete className='text-green-600' />
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

export default Diet