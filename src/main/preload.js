const { contextBridge, ipcRenderer } = require('electron')
const VALID_SEND = ['loadPL', 'error', 'get-playlist-info', 'add-playlist', 'download-playlist-info', 'remove-playlist']
const VALID_LISTEN = []

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
    on: (channel, listener) => {
        const isValidChannel =
            typeof channel === 'string' && VALID_LISTEN.includes(channel)
        if (!isValidChannel || !listener) return
        ipcRenderer.on(channel, listener)
    },

    downloadPlaylistJSON: playlist => ipcRenderer.invoke('download-playlist-info', playlist),
    chooseDir: (...args) => ipcRenderer.invoke('choose-dir', args),
    getPref: arg => ipcRenderer.invoke('get-pref', arg),
})
