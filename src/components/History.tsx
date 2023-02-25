import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react'
import { AiFillDelete } from 'react-icons/ai';
import { IoFastFood, IoFastFoodSharp } from 'react-icons/io5';

const History = ({historyLoading, setHistoryLoading, history, setHistory, changeDietFromHistory, modalChangeDietFromHistoryActive, setModalChangeDietFromHistoryActive, changeDietConfirm, savedDiet}:any) => {
    console.log(savedDiet);
    console.log(history);
  return (
    <>
        <div className="min-h-[calc(100vh-5rem)] bg-[#023430]">
            <div className='px-4 py-4 flex items-center justify-between'>
                <p className='text-white font-bold'>History</p>
            </div>
            <div className='px-4 py-2 flex gap-10'>
                {
                    historyLoading ? (
                        <div className='w-full px-4 py-2 bg-white rounded-lg'>
                            <p className='text-black text-sm font-bold'>Loading...</p>
                        </div>
                    )
                    :
                    (
                        <div className='w-full'>
                            {
                                history && history.length > 0 ? (
                                    <>
                                        {
                                            history.map((hist:any, index:any) => (
                                                <div key={index} className="w-full">
                                                    {
                                                        hist.isCustomDiet ? (
                                                            <div className='py-4 px-4 rounded-lg bg-black bg-opacity-25 w-full relative'>
                                                                {
                                                                        savedDiet.id != hist.id ? (
                                                                            <button className='absolute bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-lg -right-2 -top-5' onClick={() => changeDietFromHistory(hist.id)}>
                                                                                Use Diet
                                                                            </button>
                                                                        )
                                                                        :
                                                                        (
                                                                            <button className='absolute bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-lg -right-2 -top-5 disabled:bg-opacity-25' disabled={true}>
                                                                                Active
                                                                            </button>
                                                                        )
                                                                }
                                                                {
                                                                    hist.meals && hist.meals.map((meal:any, index:any) => (
                                                                        <div className='flex items-center justify-between py-2'>
                                                                            <div key={index} className="flex items-center gap-5">
                                                                                <div>
                                                                                    <IoFastFoodSharp className='text-white' size={24} />
                                                                                </div>
                                                                                <div><p className='text-white font-bold py-2'>{meal.name}</p></div>
                                                                            </div>
                                                                            <div>
                                                                                <input type="time" value={meal.time} disabled={true} className="text-white px-2 py-2 rounded-lg" />
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        )
                                                        :
                                                        (
                                                            <>
                                                                <div className='bg-black bg-opacity-25 px-4 py-4 my-10 rounded-lg relative'>
                                                                    {
                                                                        savedDiet.id != hist.id ? (
                                                                            <button className='absolute bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-lg -right-2 -top-5' onClick={() => changeDietFromHistory(hist.id)}>
                                                                                Use Diet
                                                                            </button>
                                                                        )
                                                                        :
                                                                        (
                                                                            <button className='absolute bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-lg -right-2 -top-5 disabled:bg-opacity-25' disabled={true}>
                                                                                Active
                                                                            </button>
                                                                        )
                                                                    }
                                                                {
                                                                hist.meals && hist.meals.map((diet:any, index:any) => (
                                                                            <div className={`${index > 0 ? 'pt-4': ''} flex items-center gap-6`} key={index}>
                                                                                <div>
                                                                                    <img src={`https://webknox.com/recipeImages/${diet.id}-556x370.jpg`} alt="" width={50} height={50} className="rounded-full" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className='text-white'>{diet.title}</p>
                                                                                </div>
                                                                                </div>
                                                                    ))
                                                                }
                                                                {
                                                                    hist.meals && hist.meals.length > 0 && hist.nutrients && (
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
                                                                                            <td className='border text-white text-center py-2'>{hist.nutrients.calories}</td>
                                                                                            <td className='border text-white text-center py-2'>{hist.nutrients.carbohydrates}</td>
                                                                                            <td className='border text-white text-center py-2'>{hist.nutrients.fat}</td>
                                                                                            <td className='border text-white text-center py-2'>{hist.nutrients.protein}</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            ))
                                        }
                                    </>
                                )
                                :
                                (
                                    <div className='w-full px-4 py-2 bg-white rounded-lg'>
                                        <p className='text-black text-sm font-bold'>No history found...</p>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
        <Transition.Root show={modalChangeDietFromHistoryActive} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setModalChangeDietFromHistoryActive}>
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
                                Are you sure you want to delete the current diet plan and use this plan?
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => {changeDietConfirm();setModalChangeDietFromHistoryActive(false);}}
                        >
                        Change plan
                        </button>
                        <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setModalChangeDietFromHistoryActive(false)}
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
    </>
  )
}

export default History