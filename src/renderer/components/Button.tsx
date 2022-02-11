import React, { ReactElement } from 'react'
import './components.scss'

type ButtonProps = {
    text: string | ReactElement
    onClick?: () => void
    className?: string
    type?: 'button' | 'submit' | 'reset'
}

const Button = (props: ButtonProps) => {
    return (
        <button
            type={props.type ? props.type : 'button'}
            className={`custom-button ${props.className}`}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    )
}

export default Button
