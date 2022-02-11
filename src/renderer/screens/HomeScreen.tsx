import React, { useEffect, useState } from 'react'
import '../App.scss'
import PlaylistsContainer from '../components/PlaylistsContainer'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import PlaylistView from '../components/PlaylistView'

const HomeScreen = () => {
    const navigate = useNavigate()
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [selectedPlaylist, setSelectedPlaylist] =
        useState<[Playlist, PlaylistFull] | null>(null)

    const [dir, setDir] = useState('')
    const [loading, setLoading] = useState(false)

    const handleDownloadInfo = async () => {
        setLoading(() => true)
        for (const pl of playlists) {
            try {
                await window.electron.invoke('download-playlist-info', pl)
            } catch (e: any) {
                window.electron.send('error', e.message)
            }
        }
        setLoading(() => false)
    }

    const handleLoadPlaylists = async () => {
        try {
            await window.electron.invoke('loadPL')
            const playlists = await window.electron.getPref('playlists')
            setPlaylists(() => playlists)
        } catch (e: any) {
            window.electron.send('error', e.message)
            setPlaylists(() => [])
        }
    }

    const handleSelectPlaylist = async (playlistToSelect: Playlist) => {
        try {
            const playlist = await window.electron.invoke(
                'get-playlist-info',
                playlistToSelect.dir
            )
            setSelectedPlaylist(() => [playlistToSelect, playlist])
        } catch (e: any) {
            window.electron.send('error', e.message)
            setSelectedPlaylist(() => null)
        }
    }

    const handleChangeDirectory = async () => {
        try {
            const newDir = await window.electron.chooseDir('save-root')
            setDir(prev => {
                if (prev !== newDir) {
                    handleLoadPlaylists()
                    setSelectedPlaylist(() => null)
                }
                return newDir
            })
        } catch (e: any) {
            window.electron.send('error', e.message)
        }
    }

    const handleDelete = async (playlist: Playlist) => {
        await window.electron.invoke('remove-playlist', playlist)
        await handleLoadPlaylists()
    }

    useEffect(() => {
        (async () => {
            await handleLoadPlaylists()
            if (playlists[0]) await handleSelectPlaylist(playlists[0])
            const newDir = await window.electron.getPref('rootDir')
            setDir(() => newDir)
        })()
    }, [])

    return (
        <div className={'container-fluid'}>
            {
                loading ?
                    <div className={'loading-div'}>
                        <div className={'fa-solid fa-rotate loading-icon'} />
                    </div>
                    : null
            }

            <div className={'row'}>
                <div className={'col-3'}>
                    <span style={{ textAlign: 'center' }}>
                        <h1>Playlisty</h1>
                    </span>
                    <div className={'button-row'}>
                        <Button
                            text={''}
                            className={'fa-solid fa-plus'}
                            onClick={() => navigate('/newPlaylist')}
                        />
                        <Button
                            text={''}
                            className={'fa-solid fa-refresh'}
                            onClick={handleLoadPlaylists}
                        />
                        <Button
                            text={''}
                            className={'fa-solid fa-download'}
                            onClick={handleDownloadInfo}
                        />
                    </div>
                    <PlaylistsContainer
                        playlists={playlists}
                        onClick={handleSelectPlaylist}
                    />
                </div>
                <div className={'col-9'}>
                    <div className={'row home-screen-top-row'}>
                        <div className={'top-row-inner'}>
                            <Button
                                text={'Změň složku'}
                                className={'choose-dir-button top-row-block'}
                                onClick={handleChangeDirectory}
                            />
                            <div className={'dir top-row-block'}> {dir} </div>
                        </div>
                    </div>
                    <PlaylistView
                        playlist={selectedPlaylist}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    )
}

export default HomeScreen
