import React, { CSSProperties, ReactElement } from 'react'
import './components.scss'
import { Style } from 'util'

type ButtonProps = {
    text: string | ReactElement
    onClick?: () => void
    className?: string
    type?: 'button' | 'submit' | 'reset'
    style?: CSSProperties
}

const Button = (props: ButtonProps) => {
    return (
        <button
            style={props.style ? props.style : {}}
            type={props.type ? props.type : 'button'}
            className={`custom-button ${props.className}`}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    )
}

export default Button
