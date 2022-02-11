import 'core-js/stable'
import 'regenerator-runtime/runtime'
import path from 'path'
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import MenuBuilder from './menu'
import { resolveHtmlPath } from './util'
import Store from './Store'
import { Playlist } from './types'

import {
    addNewPlaylist, downloadPlaylistsContentsJSON,
    getTest,
    loadPlaylistInfo,
    loadRootInfoIntoStore, removePlaylist
} from './playlistLoader'
import createLogger from './logger'
import OpenDialogOptions = Electron.OpenDialogOptions

const log = createLogger('main.ts')
const rendererLog = createLogger('renderer')

let mainWindow: BrowserWindow | null = null
if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support')
    sourceMapSupport.install()
}

const isDevelopment =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

if (isDevelopment) require('electron-debug')()

const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ['REACT_DEVELOPER_TOOLS']

    return installer
        .default(
            extensions.map(name => installer[name]),
            forceDownload
        )
        .catch(console.log)
}

export const getResourcesPath = () => {
    return app.isPackaged
        ? path.join(process.resourcesPath, 'assets')
        : path.join(__dirname, '../../assets')
}

export const getAssetPath = (...paths: string[]): string => {
    return path.join(getResourcesPath(), ...paths)
}

const createWindow = async () => {
    if (isDevelopment) await installExtensions()

    mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        minWidth: 900,
        height: 728,
        icon: getAssetPath('icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
        },
    })

    mainWindow.loadURL(resolveHtmlPath('index.html'))

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith(resolveHtmlPath(''))) {
            return {
                action: 'allow',
                preload: path.join(__dirname, 'preload.js'),
            }
        }
        shell.openExternal(url)
        return { action: 'deny' }
    })

    mainWindow.on('ready-to-show', () => {
        if (!mainWindow) throw new Error('"mainWindow" is not defined')
        if (process.env.START_MINIMIZED) mainWindow.minimize()
        else mainWindow.show()
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    const menuBuilder = new MenuBuilder(mainWindow)
    menuBuilder.buildMenu()
}

export const showError = (text: string) => {
    dialog.showErrorBox('YTDL', text)
}

/**
 * Register IPC handlers and listeners
 */
ipcMain.handle('choose-dir', async (event, args: string[]) => {
    if (mainWindow === null) return Promise.reject('Main window is null')

    const options: OpenDialogOptions = {
        properties: ['openDirectory'],
    }

    if (args.includes('default-path')) {
        const index = args.indexOf('default-path')
        options.defaultPath = args[index + 1]
    }

    const result = await dialog.showOpenDialog(mainWindow, options)

    const paths = result.filePaths
    if (!(paths.length > 0 && paths[0] !== null && paths[0] != ''))
        return Promise.reject('Unable to get path from selected directory')

    if (args.includes('save-root')) Store.set('rootDir', paths[0])
    log.debug(paths[0])
    return paths[0]
})

ipcMain.handle('get-pref', async (event, arg: string) => {
    if (!arg) return Store.store
    return Store.get(arg)
})

/**
 * Loads playlists from root/playlists.json into Electron Store
 */
ipcMain.handle('loadPL', async () => {
    try {
        await loadRootInfoIntoStore(await Store.get('rootDir'))
        return Promise.resolve()
    } catch (e: unknown) {
        return Promise.reject(e)
    }
})

/**
 * Displays dialog with error message
 */
ipcMain.on('error', (event, args: string[]) => {
    dialog.showErrorBox('YTDL', args.length > 0 ? args[0] : 'An error occured')
})

/**
 * Runs youtube-dl command, that downloads json contents of playlist into playlist.json in playlist dir
 */
ipcMain.handle('download-playlist-info', async (event, playlist: Playlist) => {
    return await downloadPlaylistsContentsJSON(playlist.dir, playlist.remoteUrl)
})

/**
 * Loads and returns json playlist contents from playlist.json file in playlist dir
 */
ipcMain.handle('get-playlist-info', async (event, ...args: string[]) => {
    if (!args || !args[0]) return Promise.reject(new Error('No path passed'))
    return await loadPlaylistInfo(args[0])
})

/**
 * Adds playlist into root/playlists.json and into Electron Store
 */
ipcMain.handle('add-playlist', async (event, playlist: Playlist) => {
    if (!playlist) return Promise.reject()
    await addNewPlaylist(playlist)
    return await loadRootInfoIntoStore(await Store.get('rootDir'))
})

/**
 * Removes playlist from root/playlists.json and from Electron Store
 */
ipcMain.handle('remove-playlist', async (event, playlist: Playlist) => {
    if (!playlist) return Promise.reject()
    await removePlaylist(playlist)
    return await loadRootInfoIntoStore(await Store.get('rootDir'))
})

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.whenReady()
    .then(() => {
        createWindow()
        app.on('activate', () => {
            if (mainWindow === null) createWindow()
        })
    })
    .catch(console.log)
