import React from 'react'
import clsx from 'clsx'
import {ButtonHTMLType, ButtonType} from 'antd/es/button';
import {useNavigate} from 'react-router-dom';

interface ButtonProps {
    text?: string;
    type?: ButtonHTMLType;
    id?: string;
    onClick?: () => void;
    disabled?: boolean;
    secondary?: boolean;
    outline?: boolean;
    children?: React.ReactNode;
    fullWitdth?: boolean;
    danger?: boolean;
    className?: string
    href?: string,
    icon?: React.ReactNode
    setWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
                                           text,
                                           type,
                                           id,
                                           onClick,
                                           disabled,
                                           secondary,
                                           outline,
                                           children,
                                           fullWitdth,
                                           danger,
                                           className,
                                           href,
                                           icon,
                                           setWidth
                                       }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={href ? () => navigate(href) : onClick}
            type={type}
            disabled={disabled}
            className={clsx(`
            flex
            justify-center
            rounded-md
            p-3
            font-bold
            text-[16px]
            hover:cursor-pointer
            gap-3
        `,
                !setWidth && 'w-full',
                disabled && 'opacity-70 cursor-default',
                fullWitdth && 'w-full',
                secondary && 'text-color bg-white border-[1px] border-[#1618231f]',
                outline && 'text-primary bg-transparent border-[1px] border-[#f42750] hover:bg-[#f4275013]',
                danger && 'bg-rose-600 hover:bg-rose-500',
                !secondary && !danger && !outline && 'hover:bg-[#f42750] bg-[#FE2C55] hover:hover:bg-gradient-to-r hover:from-transparent hover:via-transparent hover:to-transparent hover:to-red-500 text-white',
                className
            )}>
            {icon}
            {children}
        </button>
    )
}

export default Button