export type Playlist = {
    name: string
    dir: string
    remoteUrl: string
}

export type RootInfo = {
    rootDir: string
    playlists: Playlist[]
}