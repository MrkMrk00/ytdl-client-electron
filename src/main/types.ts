export type PlaylistMinInfo = {
    name: string
    dir: string
    remoteUrl: string
    lastUpdate?: string
}

export type RootDirInfo = {
    rootDir: string
    playlists: PlaylistMinInfo[]
}

export type Song = {
    author: string
    name: string
    album: string
    albumId: number
    playlistId?: number
    length: string
    year: number
}

export type PlaylistInfo = {
    name: string
    album: boolean
    author?: string
    year?: number
    songs: Song[]
}
