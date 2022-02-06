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

    const handleDirChange = async () => {
        try {
            const path = await window.electron.chooseDir()
            setDir(() => path)
        } catch (e: any) {
            window.electron.send('error', e.message)
        }
    }

    const loadPlaylists = async () => {
        const loaded = await window.electron.invoke('loadPL')
            .catch(reason => {
                window.electron.send('error', reason.toString())
            })
        const playlists = await window.electron.getPrefs('playlists')
        setPlaylists(() => playlists ? playlists : [])
    }


    if (firstRender) {
        const loadDefaults = async () => {
            const pathToRootDir = await window.electron.getPrefs('musicDir')
            setDir(() => pathToRootDir)
            const playlists = await window.electron.getPrefs('playlists')
            setPlaylists(() => playlists ?? [])
        }

        loadDefaults()
        setFirstRender(() => false)
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
                            className={'choose-dir-button'}
                            onClick={() => {handleDirChange().then(loadPlaylists)}}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeScreen
