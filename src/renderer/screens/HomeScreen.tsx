import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import '../App.scss'
import PrettyTable from '../components/PrettyTable'

type Playlist = {
    name: string
    remoteUrl: string
}

const HomeScreen = () => {
    const [firstRender, setFirstRender] = useState(true)
    const [dir, setDir] = useState('')
    const [playlists, setPlaylists] = useState<Playlist[]>([])

    const loadPlaylists = async () => {
        await window.electron.invoke('loadPL')
        const res = await window.electron.getPrefs('playlists')
        const plArray = res ? res.playlists : []
        setPlaylists(() => plArray)
    }

    const updateDir = async () => {
        const dirInConfig = (await window.electron.getPrefs(
            'musicDir'
        )) as string
        setDir(() => dirInConfig)
    }

    const chooseDir = async () => {
        const resDir = await window.electron.chooseDir()
        if (resDir === null || resDir === '') return

        updateDir()
    }

    if (firstRender) {
        loadPlaylists()
            .then(() => updateDir())
            .then(() => setFirstRender(() => false))
    }

    return (
        <div className={'container'}>
            <header className={'row'}>
                <h1> YTDL </h1>
            </header>

            <div className={'row'}>
                <div className={'col-5'}>
                    <div className={'column-header-button'}>
                        <h2> Playlisty: </h2>
                        <div>
                            <Button
                                text={''}
                                className={'fa fa-plus'}
                                onClick={() => console.log('plus')}
                            />
                            <span
                                style={{
                                    width: '15px',
                                    display: 'inline-block',
                                }}
                            />
                            <Button
                                text={''}
                                className={'fa fa-refresh'}
                                onClick={loadPlaylists}
                            />
                        </div>
                    </div>

                    <PrettyTable playlists={playlists} />
                </div>

                <div className={'col-2'} />

                <div className={'col-5'}>
                    <h2> Úložiště hudby: </h2>
                    <div className={'custom-button path-text'}>
                        <p>{dir}</p>
                    </div>
                    <div className={'row'}>
                        <div className={'col'} />
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
