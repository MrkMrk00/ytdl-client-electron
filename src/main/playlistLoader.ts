import fs from 'fs'
import Store from './Store'

export const loadPlaylists = async (path: string) => {
    const setEmpty = () => {
        Store.set('playlists', '')
    }

    const callback = (err: NodeJS.ErrnoException | null, rawData: Buffer) => {
        if (err) {
            setEmpty()
            return
        }

        const parsed = JSON.parse(rawData.toString())
        if (!parsed) {
            setEmpty()
            return
        }

        Store.set('playlists', parsed)
    }
    fs.readFile(path, callback)
}

export const loadPlaylistDetails = (path: string) => {
    const rawData = fs.readFileSync(path)
    if (!rawData) return null

    const parsed: object = JSON.parse(rawData.toString())
    return parsed ? parsed : null
}