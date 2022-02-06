import 'core-js/stable'
import 'regenerator-runtime/runtime'
import path from 'path'
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import MenuBuilder from './menu'
import { resolveHtmlPath } from './util'
import Store, { PARAMS } from './Store'
import { loadRootInfoIntoStore, RootInfoError } from './playlistLoader'
import _YTDLClass from './ytdl'
import chalk from 'chalk'

const getYtdlAsync = _YTDLClass.getAsync

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

    // Open urls in the user's browser
    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault()
        shell.openExternal(url)
    })
}

export const showError = (text: string) => {
    dialog.showErrorBox('YTDL', text)
}

/**
 * Register IPC handlers and listeners
 */

ipcMain.on('log', async (event, args) => {
    console.log(args)
})

ipcMain.handle('choose-dir', async () => {
    if (mainWindow === null) return Promise.reject('Main window is null')

    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    })

    const paths = result.filePaths
    if (paths.length > 0 && paths[0] !== null && paths[0] != '') {
        Store.set(PARAMS.musicDir, paths[0])
        return paths[0]
    }

    return Promise.reject('Unable to get path from selected directory')
})

ipcMain.handle('get-prefs', async (event, arg: string) => {
    if (!arg) return Store.store
    return Store.get(arg)
})

ipcMain.handle('loadPL', async () => {
    console.log(chalk.red('loadPL handler'))
    try {
        await loadRootInfoIntoStore(`${Store.get(PARAMS.musicDir)}`)
        return Promise.resolve()
    } catch (e: unknown) {
        return Promise.reject(JSON.stringify(e))
    }
})
ipcMain.on('error', (event, args: string[]) => {
    dialog.showErrorBox('YTDL', (args.length > 0 ? args[0] : 'An error occured'))
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
