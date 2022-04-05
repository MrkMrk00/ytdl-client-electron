import React from 'react'
import './components.scss'
import PlaylistSongView from './PlaylistSongView'
import Button from './Button'
import { RootState } from '../redux/store'
import { connect } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setLoading, setNotLoading } from '../redux/reducers'
import { selectPlaylists } from '../redux/playlistsSlice'

const PlaylistView = (props: { playlist: PlaylistFull | null }) => {
    const dispatch = useAppDispatch()
    const playlists = useAppSelector(selectPlaylists).playlists

    const handleReloadInfo = async () => {
        const filtered = playlists.filter(
            pl => pl.remoteUrl === props.playlist?.webpage_url
        )
        if (filtered.length !== 1) return

        dispatch({ type: setLoading.type })
        await window.electron.invoke('download-playlist-info', filtered[0])
        dispatch({ type: setNotLoading.type })
    }

    const handleDownload = async () => {
        const filtered = playlists.filter(
            pl => pl.remoteUrl === props.playlist?.webpage_url
        )
        if (filtered.length !== 1) return
        console.log(filtered[0])

        await window.electron
            .invoke('download-playlist', [filtered[0].dir, 'mp3'])
            .catch(console.log)
        console.log('stahnuto')
    }

    return (
        <div className={'row'}>
            <div className={'col-8'}>
                <PlaylistSongView />
            </div>
            <div className={'col-4'}>
                {props.playlist ? (
                    <div className={'playlist-view-buttons'}>
                        <Button
                            text={''}
                            className={'fa-solid fa-pen'}
                            onClick={() => {}}
                        />
                        <Button
                            text={''}
                            className={'fa-solid fa-refresh'}
                            onClick={handleReloadInfo}
                        />
                        <Button
                            text={''}
                            className={'fa-solid fa-download'}
                            onClick={handleDownload}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        playlist: state.playlists.selectedPlaylist,
    }
}

export default connect(mapStateToProps)(PlaylistView)
