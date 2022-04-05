import { promisify } from 'util'
import path from 'path'
import { Playlist, RootInfo } from '../types'
import {
    access as acs,
    appendFile as aF,
    readFile as rF,
    writeFile as fsWf,
} from 'fs'
import Store from '../Store'
import _YTDLClass from '../ytdl'
import createLogger from '../logger'
import RootInfoWriter from './RootInfoWriter'

const getYTDL = _YTDLClass.get
const log = createLogger('playlistLoader.ts')

const [writeFile, appendFile, readFile, access] = [
    promisify(fsWf),
    promisify(aF),
    promisify(rF),
    promisify(acs),
]

export const loadPlaylistsIntoStore = async (rootPath: string) => {
    const filePath = path.join(rootPath, 'playlists.json')

    try {
        await access(filePath)
    } catch (e: any) {
        return Promise.reject(e.message)
    }

    try {
        const res = await readFile(filePath)
        const json = JSON.parse(res.toString('utf-8'))
        Store.set('playlists', json.playlists)
    } catch (e: any) {
        Store.set('playlists', [])
        return Promise.reject(e.message)
    }

    return Promise.resolve()
}

export const downloadPlaylistsContentsJSON = async (
    pathToPlaylist: string,
    url: string
) => {
    const ytdl = await getYTDL()
    const exactPath = path.join(Store.get('rootDir'), pathToPlaylist)

    const filePath = path.join(exactPath, 'playlist.json')
    await access(exactPath)
    await writeFile(filePath, '')

    await ytdl.exec(['--dump-single-json', '--flat-playlist', url], data => {
        appendFile(filePath, data.toString())
    })
}

export const getPlaylistDetails = async (
    pathRelativeToRoot: string
): Promise<object> => {
    const filePath = path.join(
        Store.get('rootDir'),
        pathRelativeToRoot,
        'playlist.json'
    )
    try {
        await access(filePath)
    } catch (e: any) {
        log.debug(`error: ${e}`)
        return Promise.reject(new Error(`File ${filePath} doesn't exist`))
    }

    const res = await readFile(filePath)
    try {
        return JSON.parse(res.toString())
    } catch (e: any) {
        log.debug(`error: ${e}`)
        return Promise.reject(e)
    }
}

/**
 * Adds new playlist into root dir playlists.json file
 * @param playlist playlist object
 */
export const addNewPlaylist = async (playlist: Playlist) => {
    try {
        const writer = await RootInfoWriter.get(Store.get('rootDir'), false)
        writer.json.playlists.push(playlist)
        return await writer.write()
    } catch (e: any) {
        return Promise.reject(e.message)
    }
}

/**
 * Removes playlist from root dir playlists.json file
 * @param playlist to remove
 */
export const removePlaylist = async (playlist: Playlist) => {
    try {
        const writer = await RootInfoWriter.get(Store.get('rootDir'), false)
        log.debug(JSON.stringify(writer.json, null, 2))
        const filtered = writer.json.playlists.filter(
            it => !(it.remoteUrl === playlist.remoteUrl)
        )
        writer.json.playlists = filtered
        return await writer.write()
    } catch (e: any) {
        return Promise.reject(e.message)
    }
}
