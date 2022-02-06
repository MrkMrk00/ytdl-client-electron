import React from 'react'
import './components.scss'

type ButtonProps = {
    text: string
    onClick?: () => void
    className?: string
}

const Button = (props: ButtonProps) => {
    return (
        <button
            type={'button'}
            className={`custom-button ${props.className}`}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    )
}

export default Button
