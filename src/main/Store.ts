import Store from 'electron-store'
import { PlaylistMinInfo } from './types'

export const PARAMS = {
    musicDir: 'musicDir',
    playlists: 'playlists'
}

type StoreType = {
    musicDir: string
    playlists?: PlaylistMinInfo
}

const store = new Store<StoreType>({
    name: 'prefs',
    defaults: {
        musicDir: '',
    }
})

export default store