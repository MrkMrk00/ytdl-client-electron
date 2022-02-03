const { contextBridge, ipcRenderer } = require('electron')
const VALID_CHANNEL_NAMES = ['log', 'loadPL']

contextBridge.exposeInMainWorld(
    'electron',
    {
        send: (channel, ...args) => {
            const isValidChannel = typeof channel === 'string'
                && VALID_CHANNEL_NAMES.includes(channel)

            console.log(`electron.send ${channel} ${args}`)
            if (!isValidChannel) return
            ipcRenderer.send(channel, args)
        },
        invoke: (channel, ...args) => {
            const isValidChannel = typeof channel === 'string'
                && VALID_CHANNEL_NAMES.includes(channel)

            console.log(`electron.invoke ${channel} ${args}`)
            if (!isValidChannel) return
            return ipcRenderer.invoke(channel, args)
        },

        log: (message) => {
            ipcRenderer.send('log', message)
        },
        chooseDir: () => {
            return ipcRenderer.invoke('choose-dir')
        },
        getPrefs: (...args) => {
            return ipcRenderer.invoke('get-prefs', args)
        }
    }
)
