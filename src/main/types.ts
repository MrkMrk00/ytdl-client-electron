export type Playlist = {
    name: string
    dir: string
    remoteUrl: string
}

export type PlaylistEntry = {
    id: string
    url: string
    title: string
    duration: number
}

export type RootInfo = {
    playlists: Playlist[]
}