import React from 'react'
import { render } from 'react-dom'
import App from './App'

declare global {
    interface Window {
        electron: {
            send: (channel: string, ...args: any[]) => void
            invoke: (channel: string, ...args: any[]) => Promise<any>
            on: (
                channel: string,
                listener: (event: any, ...args: any[]) => void
            ) => void
            downloadPlaylistJSON: (playlist: Playlist) => Promise<void>
            chooseDir: (...args: string[]) => Promise<string>
            getPref: (name: string) => Promise<any>
        }
    }
    type Playlist = {
        name: string
        dir: string
        remoteUrl: string
    }
    type Song = {
        title: string
        uploader: string
        duration: number
    }
    type PlaylistFull = {
        id: string
        songCount: number
        entries: Song[]
        title: string
        uploader: string
        webpage_url: string
    }
}

render(<App />, document.getElementById('root'))
