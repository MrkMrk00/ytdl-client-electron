import React, { ReactElement, useState } from 'react'
import './components.scss'

type PrettyTableProps = {
    playlists: { name: string }[]
}

const PrettyTable = (props: PrettyTableProps) => {
    const constructTable = () => {
        const toSetElems: ReactElement[] = []

        for (let i = 0; i < props.playlists.length; i++) {
            toSetElems.push(
                <div key={i + 1} className={'row playlist-row'}>
                    <div> {props.playlists[i].name} </div>
                </div>
            )
        }
        return toSetElems
    }

    return (
        <div className={'container-fluid playlist-table'}>
            {constructTable()}
        </div>
    )
}

export default PrettyTable
