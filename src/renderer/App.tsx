import React from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import AddNewPlaylistScreen from './screens/AddNewPlaylistScreen'

const App = () => {

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