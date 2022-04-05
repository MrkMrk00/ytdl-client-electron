const { contextBridge, ipcRenderer } = require('electron')
const VALID_SEND = [
    'load-playlists',
    'error',
    'get-playlist-info',
    'add-playlist',
    'download-playlist-info',
    'remove-playlist',
    'download-playlist',
]

contextBridge.exposeInMainWorld('electron', {
    send: (channel, ...args) => {
        const isValidChannel =
            typeof channel === 'string' && VALID_SEND.includes(channel)

        if (!isValidChannel) return
        ipcRenderer.send(channel, args)
    },
    invoke: (channel, ...args) => {
        const isValidChannel =
            typeof channel === 'string' && VALID_SEND.includes(channel)

        console.log(`electron.invoke ${channel} ${args}`)
        if (!isValidChannel) return
        return ipcRenderer.invoke(channel, ...args)
    },

    chooseDir: (...args) => ipcRenderer.invoke('choose-dir', args),
    getPref: arg => ipcRenderer.invoke('get-pref', arg),
})
