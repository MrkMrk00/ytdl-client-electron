import React, { useEffect } from 'react'
import '../App.scss'
import PlaylistsContainer from '../components/PlaylistsContainer'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import PlaylistView from '../components/PlaylistView'
import { useAppDispatch } from '../redux/hooks'
import { loadPlaylists, selectPlaylist } from '../redux/playlistsSlice'
import { connect } from 'react-redux'
import { RootState } from '../redux/store'
import { setDir, setLoading, setNotLoading } from '../redux/reducers'

type HomeScreenProps = {
    playlists: Playlist[]
    selectedPlaylist: PlaylistFull | null
    loading: boolean,
    dir: string
}

const HomeScreen = (props: HomeScreenProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleDownloadInfo = async () => {
        dispatch({ type: setLoading.type })
        for (const pl of props.playlists) {
            try {
                await window.electron.invoke('download-playlist-info', pl)
            } catch (e: any) {
                window.electron.send('error', e.message)
            }
        }
        dispatch({ type: setNotLoading.type })
    }

    const handleLoadPlaylists = async () => {
        try {
            await window.electron.invoke('loadPL')
            const playlists = await window.electron.getPref('playlists')
            dispatch({ type: loadPlaylists.type, payload: playlists })
        } catch (e: any) {
            window.electron.send('error', e.message)
            dispatch({ type: loadPlaylists.type, payload: []})
        }
    }

    const handleSelectPlaylist = async (playlistToSelect: Playlist) => {
        try {
            const playlist = await window.electron.invoke(
                'get-playlist-info',
                playlistToSelect.dir
            )
            dispatch({ type: selectPlaylist.type, payload: playlist })
        } catch (e: any) {
            window.electron.send('error', e.message)
            dispatch({type: selectPlaylist.type, payload: null })
        }
    }

    const handleChangeDirectory = async () => {
        const newDir = await window.electron.chooseDir('save-root')
        if (newDir === props.dir) return
        dispatch({ type: setDir.type, payload: newDir })
    }

    const handleDelete = async (playlist: Playlist) => {
        await window.electron.invoke('remove-playlist', playlist)
        await handleLoadPlaylists()
    }

    useEffect(() => {
        (async () => {
            await handleLoadPlaylists()
            if (props.playlists[0]) await handleSelectPlaylist(props.playlists[0])
            const newDir = await window.electron.getPref('rootDir')
            dispatch({ type: setDir.type, payload: newDir })
        })()
    }, [])

    return (
        <div className={'container-fluid'}>
            {
                props.loading ?
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
                            onClick={handleDownloadInfo}
                        />
                        <Button
                            text={''}
                            className={'fa-solid fa-download'}
                        />
                    </div>
                    <PlaylistsContainer />
                </div>
                <div className={'col-9'}>
                    <div className={'row home-screen-top-row'}>
                        <div className={'top-row-inner'}>
                            <Button
                                text={'Změň složku'}
                                className={'choose-dir-button top-row-block'}
                                onClick={handleChangeDirectory}
                            />
                            <div className={'dir top-row-block'}> {props.dir} </div>
                        </div>
                    </div>
                    <PlaylistView />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        playlists: state.playlists.playlists,
        selectPlaylist: state.playlists.selectedPlaylist,
        loading: state.loading,
        dir: state.directory
    }
}

export default connect(mapStateToProps)(HomeScreen)
