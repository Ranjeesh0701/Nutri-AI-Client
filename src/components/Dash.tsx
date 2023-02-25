import React, { Fragment, useState } from 'react'
import { MdFastfood, MdOutlineClose } from 'react-icons/md'
import { Dialog, Menu, Transition } from '@headlessui/react'
import axios from 'axios';
import { FaChevronDown } from 'react-icons/fa';

interface SearchType {
  id: number,
  calories: number,
  fat: string,
  carbs: string,
  image: string,
  imageType: string,
  protein: string,
  title: string
}

const Dash = () => {

  const [isOpen, setIsOpen] = useState<any>(false);

  const [minCal, setMinCal] = useState<any>('');
  const [maxCal, setMaxCal] = useState<any>('');
  const [minProtein, setMinProtein] = useState<any>('');
  const [maxProtein, setMaxProtein] = useState<any>('');
  const [minFat, setMinFat] = useState<any>('');
  const [maxFat, setMaxFat] = useState<any>('');

  const [active, setActive] = useState(false);
  const [activeCol, setActiveCol] = useState(0);

  const [searchResults, setSearchResults] = useState<any>([]);

  const [region, setRegion] = useState("");

  // ingredient
  const [ingredients, setIngredients] = useState("");

  const search = () => {
    setSearchResults([])
    var url = `https://api.spoonacular.com/recipes/findByNutrients?apiKey=${process.env.FOOD_API_KEY}`;
    if(minCal) {
      url += `&minCalories=${minCal}`
    }
    if(maxCal) {
      url += `&maxCalories=${maxCal}`
    }
    if(minProtein) {
      url += `&minProtein=${minProtein}`
    }
    if(minFat) {
      url += `&minFat=${minFat}`
    }
    if(maxFat) {
      url += `&maxFat=${maxFat}`
    }
    if(region?.length > 0) {
      url += `&cuisine=${region}`;
    }
    url += `&number=${100}` 
    axios.get(url).then(res => {
      setSearchResults(res.data);
    }).catch((err) => {
      console.log(err);
    })

  }

  const searchByIngredient = () => {
    // if(!ingredients || ingredients.length <= 0) return;
    // setSearchResults([])
    // var url = `https://api.spoonacular.com/food/ingredients/search?apiKey=${process.env.FOOD_API_KEY}`;
    // url += `&query=${ingredients}`
    // url += `&number=${100}` 
    // // url += 'sort=calories&sortDirection=desc'
    // axios.get(url).then(res => {
    //   console.log(res);
    //   setSearchResults(res.data.results);
    // }).catch((err) => {
    //   console.log(err);
    // })
  }

  const clear = () => {
    setSearchResults([]);
    setMinCal('')
    setMaxCal('')
    setMinProtein('')
    setMaxProtein('')
    setMinFat('')
    setMaxFat('')
    setRegion('')
    setIngredients('')
  }

  return (
    <>
      <div className="min-h-[calc(100vh-5rem)] bg-[#023430]">
        <div className='p-6'>
        <div className='flex gap-4'>
          <div className='w-4/12 bg-opacity-25 bg-black px-6 py-4 rounded-xl cursor-pointer' onClick={() => {setIsOpen(true); setActiveCol(1); setSearchResults([])}}>
            <h4 className='text-white text-lg font-bold flex items-center gap-4'><MdFastfood size={23} /> Search food by nutrients</h4>
            <p className='text-white text-sm pt-4 leading-5 text-justify'>
              Find a set of food that adhere to the given nutritional limits. You may set limits for macronutrients (calories, protein, fat, and carbohydrate) and/or many micronutrients.
            </p>
          </div>
          {/* <div className='w-4/12 bg-opacity-25 bg-black px-6 py-4 rounded-xl cursor-pointer' onClick={() => {setIsOpen(true); setActiveCol(2); setSearchResults([])}}>
            <h4 className='text-white text-lg font-bold flex items-center gap-4'><MdFastfood size={23} /> Search food by ingredients</h4>
            <p className='text-white text-sm pt-4 leading-5 text-justify'>
              Search for simple whole foods (e.g. fruits, vegetables, nuts, grains, meat, fish, dairy etc.).
            </p>
          </div> */}
        </div>
        </div>
      </div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={() => setIsOpen(false)} className="relative z-10 w-full">
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
                        <div className='px-4 pt-6 flex items-center justify-between'>
                          {
                            activeCol && activeCol === 1 && (
                              <h2 className='text-xl font-bold'>Search food by nutrients</h2>
                            )
                          }
                          {
                            activeCol && activeCol === 2 && (
                              <h2 className='text-xl font-bold'>Search food by ingredients</h2>
                            )
                          }
                          <div>
                            <MdOutlineClose className='text-xl cursor-pointer' onClick={() => setIsOpen(false)} />
                          </div>
                        </div>
                        {
                          activeCol && activeCol === 1 && (
                            <div className='bg-white px-5 py-5 pb-8'>
                              {/* <Menu as="div" className="relative inline-block text-left w-full mb-4">
                                <div>
                                  <Menu.Button className="inline-flex w-full items-center gap-4 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                    {region.length === 0 ? 'Regions' : region}
                                    <FaChevronDown />
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
                                  <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                          <a
                                            href="#"
                                            onClick={() => setRegion('')}
                                            className={active ? 'bg-gray-100 text-gray-900 block px-4 py-2 text-sm' : 'text-gray-700 block px-4 py-2 text-sm'}
                                          >
                                           Regions
                                          </a>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <a
                                            href="#"
                                            onClick={() => setRegion('Indian')}
                                            className={active ? 'bg-gray-100 text-gray-900 block px-4 py-2 text-sm' : 'text-gray-700 block px-4 py-2 text-sm'}
                                          >
                                           Indian
                                          </a>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <a
                                            href="#"
                                            onClick={() => setRegion('Italian')}
                                            className={active ? 'bg-gray-100 text-gray-900 block px-4 py-2 text-sm' : 'text-gray-700 block px-4 py-2 text-sm'}
                                          >
                                            Italian
                                          </a>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <a
                                            href="#"
                                            onClick={() => setRegion('Japanese')}
                                            className={active ? 'bg-gray-100 text-gray-900 block px-4 py-2 text-sm' : 'text-gray-700 block px-4 py-2 text-sm'}
                                          >
                                            Japanese
                                          </a>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <a
                                            href="#"
                                            onClick={() => setRegion('Chinese')}
                                            className={active ? 'bg-gray-100 text-gray-900 block px-4 py-2 text-sm' : 'text-gray-700 block px-4 py-2 text-sm'}
                                          >
                                            Chinese
                                          </a>
                                        )}
                                      </Menu.Item>
                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu> */}
                              <div className='flex gap-4'>
                                <input type="number" className='px-2 border py-2 rounded-lg outline-none text-sm' placeholder='Min Calories' min={1} value={minCal} onChange={(e) => setMinCal(e.target.value)} />
                                <input type="number" className='px-2 border py-2 rounded-lg outline-none text-sm' placeholder='Max Calories' min={1} value={maxCal} onChange={(e) => setMaxCal(e.target.value)} />
                              </div>
                              <div className='flex gap-4 pt-4'>
                                <input type="number" className='px-2 border py-2 rounded-lg outline-none text-sm' placeholder='Min Proteins' min={1} value={minProtein} onChange={(e) => setMinProtein(e.target.value)} />
                                <input type="number" className='px-2 border py-2 rounded-lg outline-none text-sm' placeholder='Max Proteins' min={1} value={maxProtein} onChange={(e) => setMaxProtein(e.target.value)} />
                              </div>
                              <div className='flex gap-4 pt-4'>
                                <input type="number" className='px-2 border py-2 rounded-lg outline-none text-sm' placeholder='Min Fat' min={1} value={minFat} onChange={(e) => setMinFat(e.target.value)} />
                                <input type="number" className='px-2 border py-2 rounded-lg outline-none text-sm' placeholder='Max Fat' min={1} value={maxFat} onChange={(e) => setMaxFat(e.target.value)} />
                              </div>
                              <br />
                              <button className='mx-auto bg-[#023430] text-white rounded-lg px-2 py-3 text-sm font-bold w-6/12' onClick={search}>Search</button>
                              <button className='mx-auto  text-black rounded-lg px-2 py-3 text-sm font-bold w-6/12' onClick={clear}>Clear</button>
                              {
                                searchResults && searchResults.length > 0 && (
                                  <div>
                                  <p className='pt-4 text-sm font-bold'>Search Results</p>
                                  <div className='max-h-[40vh] overflow-y-scroll'>
                                    {
                                      searchResults.map((searchResult:SearchType) => (
                                        <div className='py-4 flex items-center gap-4' key={searchResult.id}>
                                          <img src={searchResult?.image} alt={searchResult?.title} width={50} height={50} className="rounded-full" />
                                          <p className='text-sm truncate'>{searchResult?.title}</p>
                                        </div>
                                      ))
                                    }
                                  </div>
                                </div>
                                )
                              }
                            </div>
                          )
                        }  
                        {
                          activeCol && activeCol === 2 && (
                            <div className='bg-white px-5 py-5 pb-8'>
                              
                              <div className='flex gap-4'>
                                <input type="text" className='px-2 border py-2 rounded-lg outline-none text-sm' placeholder='Incredient' value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                              </div>
                              <br />
                              <button className='mx-auto bg-[#023430] text-white rounded-lg px-2 py-3 text-sm font-bold w-6/12' onClick={searchByIngredient}>Search</button>
                              <button className='mx-auto  text-black rounded-lg px-2 py-3 text-sm font-bold w-6/12' onClick={clear}>Clear</button>
                              {
                                searchResults && searchResults.length > 0 && (
                                  <div>
                                  <p className='pt-4 text-sm font-bold'>Search Results</p>
                                  <div className='max-h-[40vh] overflow-y-scroll'>
                                    {
                                      searchResults.map((searchResult:SearchType) => (
                                        <div className='py-4 flex items-center gap-4' key={searchResult.id}>
                                          <img src={searchResult?.image} alt={searchResult?.title} width={50} height={50} className="rounded-full" />
                                          <p className='text-sm truncate'>{searchResult?.title}</p>
                                        </div>
                                      ))
                                    }
                                  </div>
                                </div>
                                )
                              }
                            </div>
                          )
                        }          
                    </Dialog.Panel>
                </Transition.Child>
            </div>
            </div>
        </Dialog>
        </Transition.Root>
    </>
    
  )
}

export default Dash