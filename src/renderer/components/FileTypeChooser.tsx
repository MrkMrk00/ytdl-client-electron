import React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../redux/store'

const FileTypeChooser = (props: { fileType: string }) => {
    return (
        <div>

        </div>
    )
}

export default connect((state: RootState) => {
    return {
        fileType: state.fileType
    }
})(FileTypeChooser)