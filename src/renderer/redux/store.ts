import { configureStore } from '@reduxjs/toolkit'
import playlistsReducer from './playlistsSlice'
import { loadingReducer, dirReducer } from './reducers'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const store = configureStore({
    reducer: {
        playlists: playlistsReducer,
        directory: dirReducer,
        loading: loadingReducer
    },
})

export default store