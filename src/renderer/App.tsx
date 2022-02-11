import React, { useEffect } from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import AddNewPlaylistScreen from './screens/AddNewPlaylistScreen'
import { loadPlaylists } from './redux/playlistsSlice'
import { useAppDispatch } from './redux/hooks'

const App = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        (async () => {
            await window.electron.invoke('loadPL')
            const playlists = await window.electron.getPref('playlists')
            dispatch({ type: loadPlaylists.type, payload: playlists })
        })()

    })

    return (
        <Router>
            <Routes>
                <Route path={'/'} element={<HomeScreen />} />
                <Route
                    path={'/newPlaylist'}
                    element={<AddNewPlaylistScreen />}
                />
            </Routes>
        </Router>
    )
}

export default App