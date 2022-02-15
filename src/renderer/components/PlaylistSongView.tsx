import React, { ReactElement } from 'react'
import './components.scss'
import { connect } from 'react-redux'
import { RootState } from '../redux/store'

const PlaylistSongView = (props: { playlist: PlaylistFull | null }) => {
    const getSongs = () => {
        if (!props.playlist) return null
        const container: ReactElement[] = []
        for (let i = 0; i < props.playlist.entries.length; i++)
            container.push(
                <div key={i} className={'row'} style={{margin: 0}}>
                    <div>
                        {i + 1}) {props.playlist.entries[i].title}
                    </div>
                </div>
            )
        return container
    }

    return (
        <div>
            <div className={'playlist-view'}>{getSongs()}</div>
        </div>
    )
}

export default connect((state: RootState) => {
    return {
        playlist: state.playlists.selectedPlaylist
    }
})(PlaylistSongView)
