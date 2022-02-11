import React, { ReactElement, useState } from 'react'
import './components.scss'
import PlaylistSongView from './PlaylistSongView'
import Button from './Button'

const PlaylistView = (props: { playlist: [Playlist, PlaylistFull] | null, onDelete: (playlist: Playlist) => void }) => {

    return (
        <div className={'row'}>
            <div className={'col-8'}>
                <PlaylistSongView playlist={ props.playlist ? props.playlist[1] : null } />
            </div>
            <div className={'col-4'}>
                { props.playlist ?
                    <div>
                        <Button
                            text={''}
                            className={'fa-solid fa-trash'}
                            onClick={() => props.onDelete(props.playlist![0])}
                        />
                    </div>
                    : null
                }
            </div>
        </div>
    )
}

export default PlaylistView
