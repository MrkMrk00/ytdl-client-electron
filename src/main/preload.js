const { contextBridge, ipcRenderer } = require('electron')
const VALID_CHANNEL_NAMES = ['log', 'loadPL', 'is-python']

contextBridge.exposeInMainWorld('electron', {
    send: (channel, ...args) => {
        const isValidChannel =
            typeof channel === 'string' && VALID_CHANNEL_NAMES.includes(channel)

        console.log(`electron.send ${channel} ${args}`)
        if (!isValidChannel) return
        ipcRenderer.send(channel, args)
    },
    invoke: (channel, ...args) => {
        const isValidChannel =
            typeof channel === 'string' && VALID_CHANNEL_NAMES.includes(channel)

        console.log(`electron.invoke ${channel} ${args}`)
        if (!isValidChannel) return
        return ipcRenderer.invoke(channel, args)
    },

    log: message => ipcRenderer.send('log', message),
    chooseDir: () => ipcRenderer.invoke('choose-dir'),
    getPrefs: (...args) => ipcRenderer.invoke('get-prefs', args),
    isPython: () => ipcRenderer.invoke('is-python'),
})
