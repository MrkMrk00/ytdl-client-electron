import { createAction, createReducer } from '@reduxjs/toolkit'

export const setLoading = createAction('loading/setTrue')
export const setNotLoading = createAction('loading/setFalse')
export const loadingReducer = createReducer(false, builder => {
    builder
        .addCase(setLoading, () => true)
        .addCase(setNotLoading, () => false)
})


export const setDir = createAction<string>('dir/setDir')
export const dirReducer = createReducer('', builder => {
    builder.addCase(setDir, (state, action) => action.payload)
})

export const setFileType = createAction<string>('fileType/setFileType')
export const fileTypeReducer = createReducer('mp3', builder => {
    builder.addCase(setFileType, (state, action) => action.payload)
})

export const setDownloading = createAction<boolean>('downloading/setDownloading')
export const downloadingReducer = createReducer(false, builder => {
    builder.addCase(setDownloading, (state, action) => action.payload)
})