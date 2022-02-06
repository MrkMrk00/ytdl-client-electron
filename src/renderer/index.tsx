import React from 'react'
import { render } from 'react-dom'
import App from './App'

declare global {
    interface Window {
        electron: {
            send: (channel: string, ...args: string[]) => void
            invoke: (channel: string, ...args: string[]) => Promise<any>
            on: (channel: string, listener: (event: any, ...args: string[]) => void) => void
            chooseDir: () => Promise<string>
            getPrefs: (name: string) => Promise<any>
        }
    }
}

render(<App />, document.getElementById('root'))
