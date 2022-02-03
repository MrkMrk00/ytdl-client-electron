import React from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'

export default function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeScreen />} />
            </Routes>
        </Router>
    )
}
