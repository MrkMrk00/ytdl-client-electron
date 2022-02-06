import { exec, spawn } from 'child_process'
import followRedirects from 'follow-redirects'
import { IncomingMessage } from 'http'
import { chmod, createWriteStream } from 'fs'
import { getAssetPath } from './main'

const { get } = followRedirects.https

export const IS_WINDOWS = process.platform === 'win32'
const YTDL_DOWNLOAD_LINK = `https://yt-dl.org/downloads/latest/youtube-dl${
    IS_WINDOWS ? '.exe' : ''
}`

/**
 * Checks asynchronously if Python is installed
 */
export const isPythonInstalled = (callback?: (val: string | null) => void) => {
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
                    if (callback) callback(null)
                } else {
                    resolve(true)
                    if (callback) callback('python3')
                }
            })
        })
    }

    return new Promise<boolean>(checkPythonWithExec)
}

export default class YTDL {
    private readonly pathToYTDL: string
    private pythonCommand: string | null = null

    constructor(onReady?: (ytdl: YTDL) => void) {
        this.pathToYTDL = getAssetPath(`ytdl${IS_WINDOWS ? '.exe' : ''}`)
        if (!IS_WINDOWS)
            this.isPython(command => (this.pythonCommand = command)).then(
                () => {
                    if (onReady) onReady(this)
                }
            )
        else if (onReady) onReady(this)
    }

    static getAsync(): Promise<YTDL> {
        const handlePromise = (resolve: (val: YTDL) => void) => {
            new YTDL(ytdl => {
                resolve(ytdl)
            })
        }

        return new Promise<YTDL>(handlePromise)
    }

    /**
     * Checks if yt-dl executable has been already downloaded
     */
    isYtdl(): Promise<boolean> {
        const handlePromise = (resolve: (val: boolean) => void) => {
            exec(`${this.pythonCommand} ${this.pathToYTDL} --version`, err =>
                resolve(!err)
            )
        }

        return new Promise(handlePromise)
    }

    /**
     * Checks if Python is installed <br>
     * Returns true if platform is Windows
     * @param commandCallback accepts Python command as argument ('python', 'python3')
     */
    isPython(commandCallback?: (val: string | null) => void): Promise<boolean> {
        if (!IS_WINDOWS) return isPythonInstalled(commandCallback)
        return new Promise(() => true)
    }

    /**
     * Checks if everything is functional (ytdl is downloaded, python is installed)
     */
    async isUsable(): Promise<boolean> {
        return (await this.isYtdl()) && (await this.isPython())
    }

    /**
     * Downloads yt-dl executable
     * @param callback accepts true if successful or Error if download failed
     */
    async downloadYtdl(callback: (param: true | Error) => void) {
        console.log(await this.isYtdl())
        if (await this.isYtdl()) {
            callback(Error('YTDL is already installed'))
            return
        }

        const file = createWriteStream(this.pathToYTDL)

        const handleDownload = (response: IncomingMessage) => {
            response.pipe(file)
            file.on('finish', () => {
                file.close(err => {
                    if (err) {
                        callback(new Error(`Failed to close file ${file.path}`))
                        return
                    }
                    if (IS_WINDOWS) {
                        callback(true)
                        return
                    }
                    chmod(file.path, 0o555, err => {
                        callback(
                            !err
                                ? true
                                : new Error(
                                    `Failed to chmod +x on file ${file.path}`
                                )
                        )
                    })
                })
            })
        }

        get(YTDL_DOWNLOAD_LINK, handleDownload)
    }

    async exec(command: string[], pushJson: (json: object) => void) {
        if (!(await this.isUsable()))
            return Promise.reject(
                new Error('Either Python or YTDL executable is not installed')
            )

        const handlePromise = (
            resolve: () => void,
            reject: (reason: Error) => void
        ) => {
            const res = spawn(
                this.pythonCommand as string,
                [this.pathToYTDL].concat(command)
            )

            res.stdout.on('data', (stdout: Buffer) => {
                pushJson(JSON.parse(stdout.toString()))
            })

            res.stderr.on('data', (data: Buffer) =>
                reject(new Error(data.toString()))
            )

            res.stdout.on('end', () => {
                resolve()
            })
        }

        return new Promise<void | Error>(handlePromise)
    }
}
