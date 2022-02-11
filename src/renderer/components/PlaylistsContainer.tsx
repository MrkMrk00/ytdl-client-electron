import React, { ReactElement, useState } from 'react'
import './components.scss'

const PlaylistsContainer = (props: {
    playlists: Playlist[]
    onClick: (selectedPlaylist: Playlist) => void
}) => {
    const constructPlaylists = () => {
        const container: ReactElement[] = []

        for (let i = 0; i < props.playlists.length; i++) {
            container.push(
                <div
                    key={i}
                    className={'button-like-div'}
                    onClick={() => props.onClick(props.playlists[i])}
                >
                    {props.playlists[i].name}
                </div>
            )
        }
        return container
    }

    return <div className={'playlist-container'}>{constructPlaylists()}</div>
}

export default PlaylistsContainer
