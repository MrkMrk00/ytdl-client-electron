import fs from 'fs'
import Store from './Store'

enum ErrorType {
    CONFIG_NOT_FOUND,
    FAILED_JSON_PARSE,
    READ_FILE_ERROR
}

export interface RootInfoError extends Error {
    type: ErrorType
}

const newErr = (message: string, type: ErrorType) => {
    return {
        name: 'RootInfoError',
        message: message,
        type: type
    } as RootInfoError
}

const getRootInfoSchema = (path: string) => {
    return {
        rootDir: path,
        playlists: [],
    }
}

export const loadRootInfoIntoStore = (pathRaw: string) => {
    const path = pathRaw + '/playlists.json'
    const setEmpty = () => Store.set('playlists', '')

    if (!fs.existsSync(path)) {
        setEmpty()
        return Promise.reject(newErr('Root dir config file not found', ErrorType.CONFIG_NOT_FOUND))
    }

    const handlePromise = (resolve: () => void, reject: (reason: RootInfoError) => void) => {
        fs.readFile(path, (err, rawData) => {
            if (err) {
                setEmpty()
                reject(newErr(err.message, ErrorType.READ_FILE_ERROR))
                return
            }

            const parsed = JSON.parse(rawData.toString())
            if (!parsed) {
                setEmpty()
                reject(newErr(`Failed to parse JSON from ${path}`, ErrorType.FAILED_JSON_PARSE))
                return
            }
            Store.set('playlists', parsed.playlists)
            resolve()
        })
    }

    return new Promise<void>(handlePromise)
}

export const loadPlaylistDetails = (path: string) => {
    return new Promise(
        (resolve: (val: object[]) => void, reject: (reason: Error) => void) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    reject(err)
                    return
                }

                const jsonArr = JSON.parse(data.toString())
                if (!Array.isArray(jsonArr)) {
                    reject(new Error('Failed to read playlist info'))
                    return
                }

                resolve(jsonArr)
            })
        }
    )
}
