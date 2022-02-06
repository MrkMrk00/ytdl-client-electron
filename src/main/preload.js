const { contextBridge, ipcRenderer } = require('electron')
const VALID_SEND = ['log', 'loadPL', 'error']
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
        return ipcRenderer.invoke(channel, args)
    },
    on: (channel, listener) => {
        const isValidChannel =
            typeof channel === 'string' && VALID_LISTEN.includes(channel)
        if (!isValidChannel || !listener) return
        ipcRenderer.on(channel, listener)
    },

    chooseDir: () => ipcRenderer.invoke('choose-dir'),
    getPrefs: (arg) => ipcRenderer.invoke('get-prefs', arg),
})
