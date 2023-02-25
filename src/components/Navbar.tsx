import React from 'react'
import { auth } from '../../config/firebase';

const Navbar = () => {

    const logout = () => {
        localStorage.removeItem('user');
        auth.signOut();
    }

  return (
    <nav className='h-20'>
            <div className='flex justify-between px-10 py-4 items-center'>
                <div>
                    <h4 className='font-extrabold text-lg cursor-pointer text-gray-900'>Nutri AI</h4>
                </div>
                <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-4'>
                        <div>
                            <p className='text-sm cursor-pointer text-gray-700'>Features</p>
                        </div>
                        <div><p className='text-sm cursor-pointer text-gray-700'>How it works?</p></div>
                    </div>
                    <button onClick={logout} className='bg-green-400 px-4 py-2 rounded-3xl font-semibold text-sm hover:bg-green-300 border border-slate-900'>Logout</button>
                </div>
            </div>
        </nav>
  )
}

export default Navbar