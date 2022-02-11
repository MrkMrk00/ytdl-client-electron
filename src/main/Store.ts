import Store from 'electron-store'
import { Playlist } from './types'

type StoreType = {
    rootDir: string
    playlists: Playlist[]
}

const store = new Store<StoreType>({
    name: 'prefs',
    defaults: {
        rootDir: '',
        playlists: []
    },
})

export default store
