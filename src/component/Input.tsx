'use client'
import React from 'react'
interface InputProps {
    label? : string;
    id : string;
    type? : string;
    required? : boolean;
    error? : string,
    disabled? : boolean
    placeholder? : string;
}
const Input : React.FC<InputProps> = ({label,id,type,required,error,disabled,placeholder}) => {
  return (
    <div className='flex flex-col'>
        {label && <label className='font-bold mb-3' htmlFor={id}>{label}</label>}
        <input className='bg-[#F1F1F2] border-[#1618231f] border-[1px] py-1 ps-3 caret-[#fe2c55] color-[#fe2c55]'
            type={type ? type : 'text'}
            id={id}
            autoComplete={id}
            disabled={disabled}
            placeholder={placeholder}
        />

    </div>
  )
}
export default Input