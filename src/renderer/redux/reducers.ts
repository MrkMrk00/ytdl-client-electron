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