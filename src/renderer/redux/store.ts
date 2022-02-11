import { configureStore } from '@reduxjs/toolkit'
import playlistsReducer from './playlistsSlice'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const store = configureStore({
    reducer: {
        playlists: playlistsReducer
    },
})

export default store