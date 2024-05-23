import React from 'react'
import logo from '../assets/logo.png'
import { QuestionCircleOutlined } from '@ant-design/icons'
import clsx from 'clsx'
export interface LayoutProps {
  children : React.ReactNode
}
const NoLayout = ({children} : LayoutProps) => {
  return (
    <>
    {children}
    </>
  )
}

export default NoLayout