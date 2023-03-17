import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { auth } from '../config/firebase';
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import {useAuthState} from 'react-firebase-hooks/auth';
import Dashboard from './pages/Dashboard';
import DietChange from './pages/DietChange';

function App() {
  const [user, setUser] = useState<any>(localStorage.getItem('user'));

  auth.onAuthStateChanged((user) => {
    console.log(user);
    setUser(user?.displayName);
    localStorage.setItem("user", user?.displayName as string)
  })

  console.log(user);

  return (
    <Router>
      <Routes>
        {user && <Route path="/" element={<Home />} />}
        {!user && <Route path="/" element={<Navigate to='/users/sign_in' />} />}

        {!user && <Route path="/users/sign_in" element={<Login />} />}
        {user && <Route path="/users/sign_in" element={<Navigate to='/' />} />}

        {!user && <Route path="/users/sign_up" element={<Register />} />}
        {user && <Route path="/users/sign_up" element={<Navigate to='/' />} />}       

        {!user && <Route path="/dashboard" element={<Navigate to='/' />} />}   
        {user && <Route path="/dashboard" element={<Dashboard user={user} />} />}

        <Route path="/user/change/diet" element={<DietChange user={user} />} />
      </Routes>
    </Router>
  )
}

export default App
