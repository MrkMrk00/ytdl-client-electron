import { RootInfo } from '../types'
import path from 'path'
import { readFile, writeFile } from 'fs/promises'

export default class RootInfoWriter {
    private constructor(
        public readonly json: RootInfo,
        private readonly path: string
    ) {}

    static async get(
        rootDir: string,
        createNew: boolean
    ): Promise<RootInfoWriter> {
        let rawFile = null
        const filePath = path.join(rootDir, 'playlists.json')
        try {
            if (!createNew) rawFile = await readFile(filePath)
        } catch (e: any) {
            return Promise.reject(e)
        }

        const json = createNew ? {} : JSON.parse(rawFile!.toString())
        return new RootInfoWriter(json, filePath)
    }

    async write(): Promise<void> {
        try {
            await writeFile(this.path, JSON.stringify(this.json, null, 2))
        } catch (e: any) {
            return Promise.reject(e.message)
        }
    }
}
