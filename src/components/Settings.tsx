import React, { useState } from 'react'
import { auth } from '../../config/firebase';

const Settings = () => {

    const user = auth.currentUser;

    const [changedUsername, setChangedUserName] = useState(user?.displayName);

    const updateUserDetails = () => {
        auth.currentUser?.updateProfile({
            displayName: changedUsername
        })
        localStorage.setItem("user", user?.displayName as string)
    }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#023430]">
        <div className='px-4 py-4 flex items-center justify-between'>
            <p className='text-white font-bold'>Profile Settings</p>
            <div>
                <button className='bg-opacity-20 bg-black text-white px-4 py-2 rounded-lg font-bold' onClick={updateUserDetails}>Save</button>
            </div>
        </div>
        <div className='px-4 py-2 flex gap-10'>
            <div className='w-6/12'>
                <div className='flex flex-col'>
                    <label htmlFor="displayName" className='text-white'>Username</label>
                    <input id="displayName" type="text" className='px-4 py-2 rounded-lg' value={changedUsername || ''} onChange={(e) => setChangedUserName(e.target.value)} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Settings