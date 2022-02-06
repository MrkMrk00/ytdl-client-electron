import fs from 'fs'
import Store from './Store'
import { showError } from './main'

const getSchema = (path: string) => {
    return {
        rootDir: path,
        playlists: [],
    }
}

export const loadRootInfo = async (pathRaw: string) => {
    const path = pathRaw + 'playlists.json'

    const setEmpty = () => {
        Store.set('playlists', '')
    }

    const generateJsonConf = () => {
        fs.writeFile(path, JSON.stringify(getSchema(pathRaw)), err => {
            if (err) showError(err.message)
        })
    }

    if (!fs.existsSync(path)) {
        setEmpty()
        return
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
