import _YTDLClass from '../ytdl'
import { readdir as readdirCallback,
    unlink as unlinkCallback } from 'fs'
import { join as path_join } from 'path'
import { promisify } from 'util'
import pathToFFMPEG from 'ffmpeg-static'
import Store from '../Store'
import { getPlaylistDetails } from './playlistLoader'
import { PlaylistEntry } from '../types'
import createLogger from '../logger'
import chalk from 'chalk'

const getYtdl = _YTDLClass.get
const [readdir, unlink] = [promisify(readdirCallback), promisify(unlinkCallback)]
const log = createLogger('playlistDownloader.ts').debug

type IndexedEntry = {
    index: number
    entry: PlaylistEntry
}

export const downloadPlaylist = async (relativePath: string, audioFormat?: string) => {
    const ytdl = await getYtdl()
    
    const constructCommandArgs = (indexedEntry: IndexedEntry) => {
        const commandArgs = [
            '-x', '--ffmpeg-location', pathToFFMPEG, '-o',
            path_join(Store.get('rootDir'), relativePath, `${indexedEntry.index + 1} - %(title)s.%(ext)s`),
            indexedEntry.entry.url
        ]
        if (audioFormat) commandArgs.push('--audio-format', audioFormat)
        return commandArgs
    }

    await deletePartiallyDownloaded(relativePath)
    const toDownload = await filterAlreadyDownloaded(relativePath)
    const threwError: IndexedEntry[] = []

    Store.set('downloadStatus', {
        percentage: 0,
        outOf: toDownload.length,
        currentIndex: 0
    })

    for (const indexedEntry of toDownload) {
        log(JSON.stringify(Store.get('downloadStatus')))
        await ytdl.exec(
            constructCommandArgs(indexedEntry),
            data => updatePercentageFromOutput(data.toString())
        ).catch(e => {
            log(e.message)
            threwError.push(indexedEntry)
        })
        Store.set(
            'downloadStatus.currentIndex',
            toDownload.indexOf(indexedEntry) - threwError.length + 1
        )
    }

    for (const indexedEntry of threwError) {
        await ytdl.exec(
            constructCommandArgs(indexedEntry),
            data => updatePercentageFromOutput(data.toString())
        ).catch(e => log(e.message))
        Store.set(
            'downloadStatus.currentIndex',
            toDownload.length - threwError.length + threwError.indexOf(indexedEntry) + 1
        )
    }
    Store.set('downloadStatus', null)
}

/**
 * Filters out songs, that have already been downloaded
 * in given directory and returns the rest from the "playlist.json" file
 * @param relativePath directory path relative to root dir of app
 */
const filterAlreadyDownloaded = async (relativePath: string) => {
    const playlistInfo: any = await getPlaylistDetails(relativePath)
    const alreadyDownloaded = await readdir(path_join(Store.get('rootDir'), relativePath))

    const toDownload: IndexedEntry[] = []
    playlistInfo.entries.forEach((entry: PlaylistEntry, index: number) => {
        const filterResult = alreadyDownloaded.filter(fileName => fileName.includes(entry.title))
        if (filterResult.length === 0) toDownload.push({index: index, entry: entry})
    })

    return toDownload
}

/**
 * Deletes all files with suffix ".part"
 * @param relativePath relative path from app root dir
 */
const deletePartiallyDownloaded = async (relativePath: string) => {
    const dirContents = await readdir(path_join(Store.get('rootDir'), relativePath))
    const partiallyDownloaded = dirContents.filter(content => /\.part$/.test(content))

    for (const path of partiallyDownloaded) {
        await unlink(path_join(Store.get('rootDir'), relativePath, path))
            .catch(e => log(e.message))
    }
}

/**
 * Gets percentage status of downloading from the ytdl-cli
 * @param data ytdl-cli output
 */
const updatePercentageFromOutput = (data: string) => {
    if (!Store.get('downloadStatus')) return

    const percentage = (/\[download].*?([0-9]{1,3}\.[0-9])%/ig).exec(data)
    if (!percentage || !percentage[1]) return
    Store.set('downloadStatus.percentage', parseFloat(percentage[1]))

    log(chalk.bold.blue(data))
}