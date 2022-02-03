import React, { ReactElement, useState } from 'react'
import './components.scss'

type PrettyTableProps = {
    playlists: {name: string}[]
}

const PrettyTable = (props: PrettyTableProps) => {

    const constructTable = () => {
        const toSetElems: ReactElement[] = []
        toSetElems.push(
            <div key={0} className={'row'} style={{fontWeight: 'bold'}}>
                <div className={'col-2'}> ID </div>
                <div className={'col-8'}> Název </div>
                <div className={'col-2'}> Počet songů </div>
            </div>
        )

        for (let i = 0; i < props.playlists.length; i++) {
            toSetElems.push(
                <div key={ i+1 } className={'row playlist-row'}>
                    <div className={'col-2'}> { i } </div>
                    <div className={'col-8'}> { props.playlists[i].name } </div>
                    <div className={'col-2'}> 6 </div>
                </div>
            )
        }
        return toSetElems
    }

    return (
        <div className={'container-fluid playlist-table'}>
            { constructTable() }
        </div>
    )
}

export default PrettyTable