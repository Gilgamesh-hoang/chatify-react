import React from 'react'

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