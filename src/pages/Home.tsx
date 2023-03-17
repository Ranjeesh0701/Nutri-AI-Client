import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';

const Home = () => {

    const navigate = useNavigate();

    const redirectToDashboard = () => {
        navigate('/dashboard');
    }

  return (
    <div className='min-h-screen'>
        <Navbar />
        <div className='flex items-center mx-auto pb-4 px-28 h-[calc(100vh-5rem)]'>
            <div className='flex-1'>
                <h1 className='text-6xl font-bold text-gray-900'>Your Health Journey <br /> Starts Here</h1>
                <p className='py-3'>Want to eat more mindfully? Track meals, learn about your habits, <br /> and reach your goals with Nutri AI.</p>
                <div>
                    <button className='bg-green-400 px-10 py-4 mt-4 rounded-3xl font-semibold text-sm hover:bg-green-300 border border-slate-900' onClick={redirectToDashboard}>Get Started</button>
                </div>
            </div>
            <div className='flex-1 h-3/5'>
                <div className='border rounded-lg h-full shadow-2xl'>

                </div>
            </div>
        </div>
    </div>
  )
}

export default Home