import React from 'react'
import { render } from 'react-dom'
import App from './App'

declare global {
    interface Window {
        electron: {
            send: (channel: string, ...args: string[]) => void,
            invoke: (channel: string, ...args: string[]) => Promise<any>,
            log: (message: string) => void,
            chooseDir: () => Promise<string | null>,
            getPrefs: (...args: string[]) => Promise<any>
        }
    }
}

render(<App />, document.getElementById('root'))
