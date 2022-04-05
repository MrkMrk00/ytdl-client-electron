import Store from 'electron-store'
import { Playlist } from './types'

type StoreType = {
    rootDir: string
    playlists: Playlist[]
    downloadStatus: {
        percentage: number
        currentIndex: number
        outOf: number
    } | null
}

const store = new Store<StoreType>({
    name: 'prefs',
    defaults: {
        rootDir: '',
        playlists: [],
        downloadStatus: null,
    },
})

export default store
