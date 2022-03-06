import { exec, execSync, spawn } from 'child_process'
import followRedirects from 'follow-redirects'
import { chmod, createWriteStream } from 'fs'
import { getAssetPath } from './main'

const { get } = followRedirects.https

export const IS_WINDOWS = process.platform === 'win32'
const YTDL_DOWNLOAD_LINK = `https://yt-dl.org/downloads/latest/youtube-dl${
    IS_WINDOWS ? '.exe' : ''
}`
const FFMPEG_DOWNLOAD_LINK = ''

const isPythonInstalled = (callback?: (val: string) => void) => {
    const checkPythonWithExec = (resolve: (val: boolean) => void) => {
        exec('python --version', err => {
            if (!err) {
                resolve(true)
                if (callback) callback('python')
                return
            }

            exec('python3 --version', err => {
                if (err) {
                    resolve(false)
                } else {
                    resolve(true)
                    if (callback) callback('python3')
                }
            })
        })
    }
    return new Promise<boolean>(checkPythonWithExec)
}

const downloadYtdl = (fullPath: string) => {
    const handlePromise = (
        resolve: () => void,
        reject: (reason: Error) => void
    ) => {
        const file = createWriteStream(fullPath)

        get(YTDL_DOWNLOAD_LINK, response => {
            response.pipe(file)
            file.on('finish', () => {
                file.close(err => {
                    if (err) {
                        reject(new Error(`Failed to close file ${file.path}`))
                        return
                    }
                    if (IS_WINDOWS) {
                        resolve()
                        return
                    }
                    chmod(file.path, 0o555, err => {
                        if (!err) resolve()
                        else
                            reject(
                                new Error(
                                    `Failed to chmod +x on file ${file.path}`
                                )
                            )
                    })
                })
            })
        })
    }
    return new Promise<void>(handlePromise)
}

export default class YTDL {
    private static instance: YTDL | null = null
    private readonly pythonCommand: string | null
    private readonly path: string

    constructor(pythonCommand: string | null, path: string) {
        this.pythonCommand = pythonCommand
        this.path = path
    }

    static async get() {
        if (YTDL.instance) return YTDL.instance
        const path = getAssetPath(IS_WINDOWS ? 'ytdl.exe' : 'ytdl')
        let pythonCommand: string | null = null

        if (!IS_WINDOWS) {
            try {
                await isPythonInstalled(cmd => (pythonCommand = cmd))
            } catch (e: unknown) {
                return Promise.reject(e)
            }
        }

        try {
            execSync(
                `${IS_WINDOWS ? '' : pythonCommand + ' '}${path} --version`
            )
        } catch (e: unknown) {
            return Promise.reject(e)
        }
        return new YTDL(pythonCommand, path)
    }

    exec(commandArgs: string[], onData: (data: Buffer) => void) {
        const res = spawn(
            IS_WINDOWS ? this.path : (this.pythonCommand as string),
            IS_WINDOWS ? commandArgs : [this.path].concat(commandArgs)
        )
        return new Promise<void>((resolve, reject) => {
            res.stdout.on('data', onData)
            res.stderr.on('data', data => reject(new Error(data.toString())))

            res.stdout.on('end', () => {
                resolve()
            })
        })
    }
}
