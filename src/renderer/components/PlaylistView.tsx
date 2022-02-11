import React from 'react'
import './components.scss'
import PlaylistSongView from './PlaylistSongView'
import Button from './Button'
import { RootState } from '../redux/store'
import { connect } from 'react-redux'

const PlaylistView = (props: { playlist: PlaylistFull | null }) => {
    return (
        <div className={'row'}>
            <div className={'col-8'}>
                <PlaylistSongView playlist={ props.playlist ? props.playlist : null } />
            </div>
            <div className={'col-4'}>
                { props.playlist ?
                    <div>
                        <Button
                            text={''}
                            className={'fa-solid fa-trash'}
                            onClick={() => {}}
                        />
                    </div>
                    : null
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        playlist: state.playlists.selectedPlaylist
    }
}

export default connect(mapStateToProps)(PlaylistView)
