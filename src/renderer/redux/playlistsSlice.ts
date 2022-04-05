import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

type PlaylistsState = {
    playlists: Playlist[]
    selectedPlaylist: PlaylistFull | null
}

const initialState: PlaylistsState = {
    playlists: [],
    selectedPlaylist: null,
}

export const playlistsSlice = createSlice({
    name: 'playlists',
    initialState,
    reducers: {
        selectPlaylist: (state, action: PayloadAction<PlaylistFull>) => {
            state.selectedPlaylist = action.payload
        },
        deselectPlaylist: state => {
            state.selectedPlaylist = null
        },
        loadPlaylists: (state, action: PayloadAction<Playlist[]>) => {
            state.playlists = action.payload
        },
    },
})

export const { selectPlaylist, deselectPlaylist, loadPlaylists } =
    playlistsSlice.actions
export const selectPlaylists = (state: RootState) => state.playlists
export default playlistsSlice.reducer
