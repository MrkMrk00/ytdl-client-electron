import _YTDLClass from './ytdl'

const getYtdl = _YTDLClass.get

export const downloadPlaylist = async (dir: string, remoteUrl: string) => {
    const ytdl = await getYtdl()
    ytdl.exec(
        [
            '-x', '--audio-format', 'mp3',
            '-o', '"%(playlist_index) - %(title)"'
        ].concat(remoteUrl),
        console.log
    )
}