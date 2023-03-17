import { Fragment, ReactComponentElement, ReactElement, useEffect, useRef, useState, VideoHTMLAttributes } from "react"
import { FaHistory, FaBars, FaPepperHot, FaAdjust, FaBell, FaCaretDown, FaSearch, FaCamera, FaUpload, FaCaretLeft, FaShare, FaShareAlt } from "react-icons/fa"
import { Dialog, Menu, Transition } from '@headlessui/react'
import { toast } from "react-toastify";
import Video from "../components/Video";
import axios from "axios";
import Dash from "../components/Dash";
import { AiFillDelete } from "react-icons/ai";
import BASE_URL from "../../config/baseUrl";
import { auth, db } from '../../config/firebase'
import Diet from "../components/Diet";
import { useSearchParams } from "react-router-dom";
import Settings from "../components/Settings";
import History from "../components/History";
import Shares from "../components/Shares";

const Dashboard = ({user}:any) => {

    const [isOpen, setIsOpen] = useState(false);

    const [devices, setDevices] = useState<any>([]);

    const [stream, setStream] = useState<MediaStream>();

    const [active, setActive] = useState(1);

    const [isImageImportOpen, setIsImageImportOpen] = useState(false);

    const [imageFile, setImageFile] = useState<File | ''>();
    const [currentImageUrl, setCurrentImageUrl] = useState<string>();

    const [file, setFile] = useState<any>();

    const [uploadLoading, setUploadLoading] = useState<Boolean>(false);

    const [results, setResults] = useState<any>();

    const [searchParams, setSearchParams] = useSearchParams();

    const [savedDiet, setSavedDiet] = useState<any>();

    const [foodView, setFoodView] = useState(false);

    const [currentFoodMealList, setCurrentMealList] = useState([]);

    const [foodViewLoading, setFoodViewLoading] = useState(false);

    const getDevices = async () => {
        const allDevices = navigator.mediaDevices.enumerateDevices();
        setDevices(allDevices);
    }

    const openCamera = () => {
        setIsOpen(true);

        navigator.mediaDevices.getUserMedia({video: true}).then((stream: MediaStream) => {
            setStream(stream);
        })
        .catch(err => {
            toast.error('Something went wrong', {
                position: 'bottom-right',
                autoClose: 1000
            })
        })


        // const getCalorie = async () => {
        //     axios.get(`${BASE_URL}/get-calorie/`)
        // }

        // getCalorie();
                
    }

    function getBase64(file:File) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          setFile(reader.result)
        };
        reader.onerror = function (error) {
          console.log(error);
        };
     }

    const handleUploadClick = () => {
        if (!imageFile) {
            return;
        }
        setResults('');
        setUploadLoading(true);
        const formData = new FormData();
        getBase64(imageFile);
        console.log(file);
        if(!file) {
            setUploadLoading(false);
            return;
        };
        formData.append('file', file)
        const config = {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }
        axios.post(`${BASE_URL}/get-calorie`, formData, config).then((res) => {
            axios.get(`https://api.edamam.com/api/food-database/parser?nutrition-type=logging&app_id=07d50733&app_key=80fcb49b500737827a9a23f7049653b9&ingr=${res.data.data.split(',')[0]}`).then((res2) => {
                setUploadLoading(false);
                console.log(res2);
                setResults(res2.data.parsed[0].food)
            }).catch((error) => {
                console.log(error);
                setUploadLoading(false);
            })
        }).catch((err) => {
            setUploadLoading(false);
        })
    };

    const openImportImage = () => {
        setIsImageImportOpen(true);
    }


    // Diet Page props

    const [customDiet, setCustomDiet] = useState([{
        id: 0,
        name: '',
        time: ''
    }])

    const [dietLoading, setDietLoading] = useState(true);

    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if(!userId) return;
        db.collection('dietplan').where('userId','==', userId).onSnapshot(querySnapshot => {
            querySnapshot.docs.map(doc => {
                var data = doc.data();
                setSavedDiet(data)
                setDietLoading(false);
            })
        })
        if(!savedDiet)
            setDietLoading(false)
    }, [userId, savedDiet])

    const [timeFrame, setTimeFrame] = useState('day')

    const [calorie, setCalorie] = useState('');

    const [glutenFree, setGlutenFree] = useState(false);

    const [vegetarian, setVegetarian] = useState(false);

    const [ketogenic, setKetogenic] = useState(false);

    const [currentMeal, setCurrentMeal] = useState<any>(null);

    const [selectedMeal, setSelectedMeal] = useState(null);

    const [customPlan, setCustomPlan] = useState(false);

    const createDietPlan = () => {
        setCurrentMeal(null)
        var url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${process.env.FOOD_API_KEY}&timeFrame=${timeFrame || 'day'}`
        if(calorie !== '') {
            url += `&targetCalories=${calorie}`
        }
        if(glutenFree) {
            url += `&diet=${glutenFree}`
        }
        if(vegetarian) {
            url += `&diet=${vegetarian}`
        }
        if(ketogenic) {
            url += `&diet=${ketogenic}`
        }

        axios.get(url).then(res => {
            console.log(res);
            setCurrentMeal(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const addCustomMealField = () => {
        setCustomDiet([...customDiet, {id: customDiet.length++, name: '', time: ''}]);
    }

    const deleteCustomMeal = (id:any) => {
        setCustomDiet(customDiet.filter(diet => diet.id !== id))
    }

    const updateValue = (value:any, id:any) => {
        setCustomDiet(customDiet.map(diet => {
            if(diet.id === id) {
                diet.name = value;
            }
            return diet;
        }))
    } 

    const updateCustomMealTime = (value:any, id:any) => {
        setCustomDiet(customDiet.map(diet => {
            if(diet.id === id) {
                diet.time = value;
            }
            return diet;
        }))
    }   

    const saveCustomPlan = () => {
        if(customPlan && (customDiet && customDiet.filter((diet:any) => diet.name !== '').length <= 0)) {
            toast.error('Please fill all the diet plan fields', {
                position: 'bottom-right',
                autoClose: 1000
            })
            return;
        }
        setDietLoading(true)
        const userId = auth.currentUser?.uid;
        const timestamp = new Date();
        const ref = db.collection('dietplan').doc();
        ref.set({
            userId,
            meals: customDiet,
            createdAt: timestamp,
            isCustomDiet: true,
            id: ref.id
        }).then((res) => {
            console.log(res);
            setSavedDiet({
                userId,
                meals: customDiet,
                createdAt: timestamp,
                isCustomDiet: true,
                id: ref.id
            });
            db.collection('history').add({
                userId,
                meals: customDiet,
                createdAt: timestamp,
                isCustomDiet: true,
                id: ref.id
            }).then((res) => {
                setDietLoading(false)
            })
            .catch((err) => {
                setDietLoading(false)
            })
        }).catch(err => {
            console.log(err);
            setDietLoading(false)
        })
    }

    const [changePlanOpen, setChangePlanOpen] = useState(false);
    const [changePlanLoading, setChangePlanLoading] = useState(false);

    const changePlan = () => {
        setChangePlanLoading(true);
        db.collection('dietplan').where('userId','==',userId).get().then(snapshot => {
            snapshot.docs[0].ref.delete().then(() => {
                setSavedDiet(null);
                setChangePlanLoading(false);
                setChangePlanOpen(false);
            })
        }).catch((err) => {
            console.log(err);
            setChangePlanLoading(false);
            setChangePlanOpen(false);
        })
    }

    const saveSuggestedPlan = () => {
        console.log(currentMeal);
        if(!currentMeal) return;
        setDietLoading(true)
        const userId = auth.currentUser?.uid;
        const timestamp = new Date();
        const ref = db.collection('dietplan').doc();
        ref.set({
            userId,
            meals: currentMeal.meals,
            createdAt: timestamp,
            isCustomDiet: false,
            nutrients: currentMeal.nutrients,
            id: ref.id
        }).then((res) => {
            setSavedDiet({
                userId,
                meals: currentMeal.meals,
                createdAt: timestamp,
                isCustomDiet: false,
                nutrients: currentMeal.nutrients,
                id: ref.id
            });
            db.collection('history').add({
                userId,
                meals: currentMeal.meals,
                createdAt: timestamp,
                isCustomDiet: false,
                nutrients: currentMeal.nutrients,
                id: ref.id
            }).then((res) => {
                setDietLoading(false)
            })
            .catch((err) => {
                setDietLoading(false)
            })
        }).catch(err => {
            console.log(err);
            setDietLoading(false)
        })
    }

    const getRelatedFoodMeals = () => {
        if(!results) return;
        console.log(results);
        setFoodView(true);
        setFoodViewLoading(true);
        axios.get(`https://www.edamam.com/api/recipes/v2?type=public&q=${results.label}&_=1677062434271`).then((res) => {
            setCurrentMealList(res?.data?.hits)
            setFoodViewLoading(false);
        })
        .catch(error => {
            console.log(error);
            setFoodViewLoading(true);
        })
    }


    const [shareModal, setShareModal] = useState(false);

    const shareUnSavedDiet = () => {

    }   

    // Settings page


    // History page
    const [historyLoading, setHistoryLoading] = useState(true);

    const [history, setHistory] = useState<any>([]);

    const [modalChangeDietFromHistoryActive, setModalChangeDietFromHistoryActive] = useState<any>(false);

    const [activeDietFromHistory, setActiveDietFromHistory] = useState('')

    useEffect(() => {

        db.collection('history').orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
            const hist = [] as any
            querySnapshot.docs.map(doc => {
                const data = doc.data();
                hist.push(data)
            })
            setHistory(hist)
            setHistoryLoading(false);
        })

    }, [])

    const changeDietFromHistory = (id:any) => {
        setModalChangeDietFromHistoryActive(true);
        setActiveDietFromHistory(id);
    }

    const [changeDietFromHistoryLoading, setChangeDietFromHistoryLoading] = useState(false);

    const changeDietConfirm = () => {
        setChangeDietFromHistoryLoading(true)
        const currentMeal = history.filter((hist:any) => hist.id === activeDietFromHistory)[0];
        if(currentMeal.isCustomDiet) {
            const userId = auth.currentUser?.uid;
            const timestamp = new Date();
            const ref = db.collection('dietplan').doc();
            ref.set({
                userId,
                meals: currentMeal.meals,
                createdAt: timestamp,
                isCustomDiet: true,
                id: currentMeal.id
            }).then((res) => {
                console.log(res);
                setSavedDiet({
                    userId,
                    meals: currentMeal.meals,
                    createdAt: timestamp,
                    isCustomDiet: true,
                    id: currentMeal.id
                });
                setChangeDietFromHistoryLoading(false)
                setModalChangeDietFromHistoryActive(false);
                setActive(3);
            }).catch(err => {
                console.log(err);
                setChangeDietFromHistoryLoading(false)
                setModalChangeDietFromHistoryActive(false);
            })
        }
        else {
            const timestamp = new Date();
            const ref = db.collection('dietplan').doc();
            ref.set({
                userId,
                meals: currentMeal.meals,
                createdAt: timestamp,
                isCustomDiet: false,
                nutrients: currentMeal.nutrients,
                id: currentMeal.id
            }).then((res) => {
                setSavedDiet({
                    userId,
                    meals: currentMeal.meals,
                    createdAt: timestamp,
                    isCustomDiet: false,
                    nutrients: currentMeal.nutrients,
                    id: currentMeal.id
                });
                setChangeDietFromHistoryLoading(false);
                setModalChangeDietFromHistoryActive(false);
                setActive(3);
            }).catch(err => {
                console.log(err);
                setChangeDietFromHistoryLoading(false);
                setModalChangeDietFromHistoryActive(false);
            })
        }
    }

    // Shares page
    const [shareDiet, setShareDiet] = useState<any>([{
        id: 0,
        name: '',
        time: ''
    }]);

    const updateShareFoodName = (value:any, id:any) => {
        setShareDiet(shareDiet.map((diet:any) => {
            if(diet.id === id) {
                diet.name = value;
            }
            return diet;
        }))
    } 

    const updateShareMealTime = (value:any, id:any) => {
        setShareDiet(shareDiet.map((diet:any) => {
            if(diet.id === id) {
                diet.time = value;
            }
            return diet;
        }))
    }   

    const deleteShareMeal = (id:any) => {
        setShareDiet(shareDiet.filter((diet:any) => diet.id !== id))
    }

    const addShareMealField = () => {
        setShareDiet([...shareDiet, {id: customDiet.length++, name: '', time: ''}]);
    }

  return (
    <>
        <div className='min-h-screen'>
            <div className='min-h-screen w-full'>
                <div className='w-1/5 bg-[#023430] border-r border-gray-300 h-full fixed'>
                    <div className='h-[calc(100vh-5rem)]'>
                        <div className="px-5 py-5 h-20 flex items-center bg-opacity-20 bg-black">
                            <p className="text-white cursor-pointer font-bold text-2xl">Nutri AI</p>
                        </div>
                        <div className="bg-opacity-25 bg-black h-full">
                            <div className={`px-5 flex items-center gap-4 mb-2 py-5 cursor-pointer ${active === 1 && 'bg-[#023430] border-l-4 border-l-[#00f24c]'}`} onClick={() => {if(active === 1)return; setActive(1)}}>
                                <FaBars color="white" />
                                <p className='text-white'>Dashborad</p>
                            </div>
                            <div className={`px-5 flex items-center gap-4 my-2 py-5 cursor-pointer ${active === 2 && 'bg-[#023430] border-l-4 border-l-[#00f24c]'}`} onClick={() => {if(active === 2)return; setActive(2)}}>
                                <FaHistory color="white" />
                                <p className='text-white'>History</p>
                            </div>
                            <div className={`px-5 flex items-center gap-4 my-2 py-5 cursor-pointer ${active === 3 && 'bg-[#023430] border-l-4 border-l-[#00f24c]'}`} onClick={() => {if(active === 3)return; setActive(3)}}>
                                <FaPepperHot color="white" />
                                <p className='text-white'>Diet Plan</p>
                            </div>
                            <div className={`px-5 flex items-center gap-4 my-2 py-5 cursor-pointer ${active === 4 && 'bg-[#023430] border-l-4 border-l-[#00f24c]'}`} onClick={() => {if(active === 4)return; setActive(4)}}>
                                <FaShareAlt color="white" />
                                <p className='text-white'>Shares</p>
                            </div>
                            {/* <div className={`px-5 flex items-center gap-4 my-2 py-5 cursor-pointer ${active === 4 && 'bg-[#023430] border-l-4 border-l-[#00f24c]'}`} onClick={() => {if(active === 4)return; setActive(4)}}>
                                <FaBell color="white" />
                                <p className='text-white'>Notifications</p>
                            </div> */}
                            <div className={`px-5 flex items-center gap-4 my-2 py-5 cursor-pointer ${active === 5 && 'bg-[#023430] border-l-4 border-l-[#00f24c]'}`} onClick={() => {if(active === 5)return; setActive(5)}}>
                                <FaAdjust color="white" />
                                <p className='text-white'>Settings</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-4/5 min-h-full ml-auto'>
                    <div className="h-20 bg-[#023430]">
                        <div className="px-10 flex items-center justify-between h-full bg-opacity-25 bg-black">
                            <div>
                                <div className="flex items-center gap-4 rounded px-3 py-2 bg-[#023430] outline-none text-white">
                                    <FaSearch color="#ccc" />
                                    <input type="text" placeholder="Search..." className="bg-transparent outline-none"  />
                                </div>
                            </div>
                            <div className="ms-auto flex gap-4 items-center cursor-pointer">
                                <div>
                                    <FaUpload color="white" size={20} className="cursor-pointer" onClick={() => openImportImage()} />
                                </div>
                                <div>
                                    <FaCamera color="white" size={20} className="cursor-pointer" onClick={() => openCamera()} />
                                </div>
                                <div className="h-8 w-[1px] rounded-[50%] bg-white"></div>
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className="inline-flex w-full items-center gap-2 justify-center px-4 py-2 text-sm font-medium">
                                        <div className="h-10 w-10 rounded-[50%] bg-white">
                                        </div>
                                        <div className="flex items-center">
                                            <div>
                                                <p className="text-white text-sm">{user || ''}</p>
                                            </div>
                                            <div>
                                                <FaCaretDown color="white" />
                                            </div>
                                        </div>
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                onClick={() => auth.signOut()}
                                                href="#"
                                                className={
                                                    active ? 'bg-gray-100 text-gray-900 block px-4 py-2 text-sm' : 'text-gray-700 block px-4 py-2 text-sm'
                                                }
                                                >
                                                Log out
                                                </a>
                                            )}
                                            </Menu.Item>
                                        </div>
                                        </Menu.Items>
                                    </Transition>
                                    </Menu>
                            </div>
                        </div>
                    </div>  
                    {
                        active && active === 1 && (
                            <Dash />
                        )
                    } 
                    {
                        active && active === 2 && (
                            <History
                                historyLoading={historyLoading}
                                setHistoryLoading={setHistoryLoading}
                                history={history}
                                setHistory={setHistory}
                                changeDietFromHistory={changeDietFromHistory}
                                modalChangeDietFromHistoryActive={modalChangeDietFromHistoryActive}
                                setModalChangeDietFromHistoryActive={setModalChangeDietFromHistoryActive}
                                changeDietConfirm={changeDietConfirm}
                                savedDiet={savedDiet}
                                changeDietFromHistoryLoading={changeDietFromHistoryLoading}
                            />
                        )
                    }  
                    {
                        active && active === 3 && (
                            <Diet 
                                timeFrame={timeFrame} 
                                setTimeFrame={setTimeFrame} 
                                calorie={calorie} 
                                setCalorie={setCalorie} 
                                glutenFree={glutenFree} 
                                setGlutenFree={setGlutenFree}
                                vegetarian={vegetarian}
                                setVegetarian={setVegetarian}
                                ketogenic={ketogenic}
                                setKetogenic={setKetogenic}
                                currentMeal={currentMeal}
                                setCurrentMeal={setCurrentMeal}
                                selectedMeal={selectedMeal}
                                setSelectedMeal={setSelectedMeal}
                                customPlan={customPlan}
                                setCustomPlan={setCustomPlan}
                                customDiet={customDiet}
                                setCustomDiet={setCustomDiet}
                                createDietPlan={createDietPlan}
                                addCustomMealField={addCustomMealField}
                                deleteCustomMeal={deleteCustomMeal}
                                updateValue={updateValue}
                                updateCustomMealTime={updateCustomMealTime}
                                saveCustomPlan={saveCustomPlan}
                                dietLoading={dietLoading}
                                savedDiet={savedDiet}
                                changePlan={changePlan}
                                saveSuggestedPlan={saveSuggestedPlan}
                                shareUnSavedDiet={shareUnSavedDiet}
                                shareModal={shareModal}
                                setShareModal={setShareModal}
                                changePlanOpen={changePlanOpen}
                                setChangePlanOpen={setChangePlanOpen}
                                changePlanLoading={changePlanLoading}
                            />
                        )
                    }  
                    {
                        active && active === 4 && (
                            <Shares
                                shareDiet={shareDiet}
                                setShareDiet={setShareDiet}
                                updateShareFoodName={updateShareFoodName}
                                updateShareMealTime={updateShareMealTime}
                                deleteShareMeal={deleteShareMeal}
                                addShareMealField={addShareMealField}
                            />
                        )
                    }  
                    {
                        active && active === 5 && (
                            <Settings />
                        )
                    }  

                </div>
            </div>
        </div>
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" onClose={() => setIsOpen(false)} className="relative z-10">
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
                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                            <div className="min-h-[70vh] min-w-[50vw] bg-black flex items-center justify-center">
                                {
                                    stream && (
                                        <Video srcObject={stream} autoPlay isOpen={isOpen} openCamera={openCamera}  />
                                    )
                                }
                            </div>                      
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
                </div>
            </Dialog>
        </Transition.Root>
        <Transition.Root show={isImageImportOpen} as={Fragment}>
            <Dialog as="div" onClose={() => setIsImageImportOpen(false)} className="relative z-10">
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

                {
                    !foodView ? (
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
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                                    <div className="min-h-[90vh]  min-w-[50vw] bg-white flex flex-col items-center justify-center overflow-y-scroll">
                                        {
                                            !imageFile ? (
                                                <div className="flex items-center justify-center w-full px-10">
                                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                        </div>
                                                        <input id="dropzone-file" type="file" className="hidden" onChange={(e) => {
                                                            e.target.files && setImageFile(e.target.files[0]);
                                                            e.target.files && getBase64(e.target.files[0])
                                                        }} />
                                                    </label>
                                                </div>
                                            )   
                                            :
                                            (
                                                <div className="flex-row items-center gap-4 pt-10">
                                                    <div className="mx-auto">
                                                        <img src={file} alt="" width={700} className="rounded-lg" />
                                                    </div>
                                                    <div className="flex items-center justify-center gap-4 mt-4">
                                                        {imageFile.name}
                                                        <AiFillDelete className="cursor-pointer text-red-600" onClick={() => {setImageFile(''); setFile(''); setResults('')}} />
                                                    </div>
                                                </div>
                                            )
                                        }
                                        
                                        <div className="pt-4 flex gap-6">
                                            <button className="bg-green-700 px-6 py-2 rounded-lg text-white text-sm font-bold disabled:bg-green-400" onClick={handleUploadClick} disabled={!imageFile || results}>
                                                {
                                                    uploadLoading ? (
                                                        <span className="flex items-center py-2 gap-4">
                                                            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                            </svg>
                                                            Scanning
                                                        </span>
                                                    )
                                                    :
                                                    (
                                                        <>
                                                            Scan Image
                                                        </>
                                                    )
                                                }
                                            </button>
                                            {
                                                imageFile && results && (
                                                    <button className="bg-green-700 px-6 py-2 rounded-lg text-white text-sm font-bold disabled:bg-green-400" onClick={getRelatedFoodMeals}>Get food meals</button>
                                                )
                                            }
                                        </div>    
                                        {
                                            imageFile && results && (
                                                <div className="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg flex w-full px-10 rounded-lg pt-4 pb-10">
                                                    <table className="w-full h-full text-sm text-left text-gray-500 dark:text-gray-400">
                                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                            <tr>
                                                                <th scope="col" className="px-6 py-3 border border-gray-500">
                                                                    Name
                                                                </th>
                                                                <th scope="col" className="px-6 py-3 border border-gray-500">
                                                                    Calorie
                                                                </th>
                                                                <th scope="col" className="px-6 py-3 border border-gray-500">
                                                                    Fat
                                                                </th>
                                                                <th scope="col" className="px-6 py-3 border border-gray-500">
                                                                    Protein
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-500">
                                                                    {results.label}
                                                                </th>
                                                                <td className="px-6 py-4 border border-gray-500">
                                                                    {results?.nutrients?.ENERC_KCAL}
                                                                </td>
                                                                <td className="px-6 py-4 border border-gray-500">
                                                                    {results?.nutrients?.FAT}
                                                                </td>
                                                                <td className="px-6 py-4 border border-gray-500">
                                                                    {results?.nutrients?.PROCNT}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )
                                        }
                                    </div>            
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                            </div>
                    )
                    :
                    (
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
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                                    <div className="min-h-[90vh] max-h-[90vh] min-w-[50vw] bg-white pb-10 overflow-scroll">
                                        <div className="py-4 px-4 flex items-center justify-between">
                                            <div className="flex items-center" onClick={() => setFoodView(false)}>
                                                <FaCaretLeft size={24} className="cursor-pointer" /><p className="text-sm cursor-pointer">Back</p>
                                            </div>
                                            <div className="mr-8">
                                                Food Meals ({results.label})
                                            </div>
                                            <div>

                                            </div>
                                        </div>
                                        <div className="px-4">
                                            {
                                                foodViewLoading ? (
                                                    <>Loading...</>
                                                )
                                                :
                                                (
                                                    <>
                                                        {
                                                            currentFoodMealList && currentFoodMealList.length > 0 ? (
                                                                <div className="overflow-scroll">
                                                                    {
                                                                        currentFoodMealList.map((meal:any, index:any) => (
                                                                            <div key={index}>
                                                                                <div className="pt-4 pb-2 flex items-center gap-4">
                                                                                    <div>
                                                                                        <img src={meal?.recipe?.image} alt="" width={40} className="rounded-full" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-sm">{meal.recipe.label}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-xs pb-2">Meal type: {meal.recipe.mealType}</p>
                                                                                    <p className="text-xs pb-2">Calories: {meal.recipe.calories}</p>
                                                                                </div>
                                                                                <div className="border">

                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            )
                                                            :
                                                            (
                                                                <div className="px-4">
                                                                    No meal found...
                                                                </div>
                                                            )
                                                        }
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>            
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    )
                }
            </Dialog>
        </Transition.Root>
    </>
  )
}

export default Dashboard