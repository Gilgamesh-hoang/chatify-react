import { userSelector } from '../redux/selector';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const Home = () => {
    const token = localStorage.getItem('token') || '';
    const user = useSelector(userSelector);
    useEffect(()=> {
        
        if (!user.username && !token) {
            window.location.href='/login'
        }
        if (user.username && !token) {
        }
        
    },[])
  return (
    <div>Home</div>
  )
}

export default Home