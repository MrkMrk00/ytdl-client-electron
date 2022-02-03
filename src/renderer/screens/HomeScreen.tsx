import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import '../App.scss'
import PrettyTable from '../components/PrettyTable'

type Playlist = {
    name: string
    remoteUrl: string
}

const HomeScreen = () => {
    const [dir, setDir] = useState('')
    const [playlists, setPlaylists] = useState<Playlist[]>([])

    const loadPlaylists = async () => {
        await window.electron.invoke('loadPL')
        const res = await window.electron.getPrefs('playlists')
        const plArray = res ? res.playlists : []
        setPlaylists(() => plArray)
    }

    const updateDir = async () => {
        const dirInConfig = await window.electron.getPrefs('musicDir') as string
        setDir(() => dirInConfig)
    }

    const chooseDir = async () => {
        const resDir = await window.electron.chooseDir()
        if (resDir === null || resDir === '') return

        updateDir()
    }

    useEffect(() => {
        console.log(playlists)
    })

    updateDir()

    return (
        <div className={'container'}>
            <header className={'row'}>
                <h1> YTDL </h1>
            </header>

            <div className={'row'}>
                <div className={'col-5'}>

                    <div className={'column-header-button'}>
                        <h2> Playlisty: </h2>
                        <Button
                            text={''}
                            className={'fa fa-refresh'}
                            onClick={loadPlaylists}
                        />
                    </div>

                    <PrettyTable playlists={playlists}
                    />

                </div>

                <div className={'col-2'} />

                <div className={'col-5'}>
                    <h2> Úložiště hudby: </h2>
                    <div className={'custom-button path-text'}>
                        <p>{ dir }</p>
                    </div>
                    <div className={'row'}>
                        <div className={'col'}/>
                        <Button
                            text={'Změň složku'}
                            onClick={chooseDir}
                            className={'choose-dir-button'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeScreen