import React, { ReactElement } from 'react'
import './components.scss'
import { connect } from 'react-redux'
import { RootState } from '../redux/store'
import { useAppDispatch } from '../redux/hooks'
import { selectPlaylist } from '../redux/playlistsSlice'

type ContainerProps = {
    playlists: Playlist[]
}

const PlaylistsContainer = (props: ContainerProps) => {
    const dispatch = useAppDispatch()

    const handleSelectPlaylist = async (playlist: Playlist) => {
        const selected = await window.electron.invoke('get-playlist-info', playlist.dir)
        dispatch({ type: selectPlaylist.type, payload: selected })
    }

    const constructPlaylists = () => {
        const container: ReactElement[] = []
        for (let i = 0; i < props.playlists.length; i++) {

            container.push(
                <div
                    key={i}
                    onClick={() => handleSelectPlaylist(props.playlists[i])}
                    className={'button-like-div'}
                >
                    {props.playlists[i].name}
                </div>
            )
        }
        return container
    }

    return <div className={'playlist-container'}>{constructPlaylists()}</div>
}


export default connect(
    (state: RootState) => {
        return {
            playlists: state.playlists.playlists
        }}
)(PlaylistsContainer)
