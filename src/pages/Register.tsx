import React from 'react'
import Auth from './component/Auth'
import {useSelector} from "react-redux";
import {RootState} from "~/redux/store";

const Register = () => {
  // const username = useSelector((state: RootState) => state.user.username);
  const username = useSelector((state: RootState) => state.app.user.username);
  console.log( 'username',username)

  return (
    <Auth action='REGISTER'></Auth>
  )
}

export default Register