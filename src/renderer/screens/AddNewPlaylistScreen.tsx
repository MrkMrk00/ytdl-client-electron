import React, { useState, ChangeEvent, useEffect } from 'react'
import Button from '../components/Button'
import '../App.scss'
import { useNavigate } from 'react-router-dom'

const AddNewPlaylistScreen = () => {
    const navigate = useNavigate()

    const [rootDir, setRootDir] = useState('')
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [path, setPath] = useState('/')

    const handleNameChange = (event: ChangeEvent) => {
        const value = (event.target as HTMLInputElement).value
        setName(() => value)
    }

    const handleUrlChange = (event: ChangeEvent) => {
        const value = (event.target as HTMLInputElement).value
        setUrl(() => value)
    }

    const handleDirChange = async () => {
        try {
            const newPath = await window.electron.chooseDir(
                'default-path',
                rootDir
            )

            if (!newPath.startsWith(rootDir)) {
                window.electron.send(
                    'error',
                    'Folder is not in current ytdl root directory'
                )
                return
            }
            const re = new RegExp(`${rootDir}(.*)`, 'gi')
            const reResult = re.exec(newPath)
            if (!reResult || !reResult[1] || reResult[1] === '') return
            setPath(() => reResult[1])
        } catch (e: any) {}
    }

    const handleSubmit = async () => {
        if (name === '' || url === '' || path === '') return
        await window.electron
            .invoke('add-playlist', {
                name: name,
                dir: path,
                remoteUrl: url,
            })
            .catch(e => {
                window.electron.invoke('error', e.message)
            })
        navigate('/')
    }

    useEffect(() => {
        (async () => {
            const awaitedRootDir = await window.electron.getPref('rootDir')
            setRootDir(() => awaitedRootDir)
        })()
    }, [])

    return (
        <div className={'container-fluid p-3'}>
            <span>
                <Button
                    text={''}
                    className={'fa-solid fa-arrow-left'}
                    onClick={() => navigate('/')}
                />
            </span>
            <div className={'container-md add-playlist-container'}>
                <div className={'playlist-inner-container'}>
                    <span style={{ justifyContent: 'center' }}>
                        <h1>Vytvoř nový playlist</h1>
                    </span>
                    <span>
                        <label className={'material-block'}>Název:</label>
                        <input
                            onChange={handleNameChange}
                            type={'text'}
                            className={'material-block'}
                        />
                    </span>
                    <span>
                        <label className={'material-block'}>URL:</label>
                        <input
                            onChange={handleUrlChange}
                            type={'text'}
                            className={'material-block'}
                        />
                    </span>
                    <span>
                        <label className={'material-block'}>Složka:</label>
                        <input
                            onClick={handleDirChange}
                            className={'material-block'}
                            readOnly={true}
                            value={path}
                        />
                    </span>
                    <Button text={'Vytvořit'} onClick={handleSubmit} />
                </div>
            </div>
        </div>
    )
}

export default AddNewPlaylistScreen
