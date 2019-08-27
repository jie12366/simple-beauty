import {
    RECORD_TOKEN,
    SAVE_HEAD_IMG,
    SAVE_UID
} from './mutation-types'
export default {
    // 记录token
    [RECORD_TOKEN] (state, token) {
        state.token = token
    },
    // 记录用户头像
    [SAVE_HEAD_IMG] (state, imgUrl) {
        state.imgUrl = imgUrl
    },
    // 记录用户id
    [SAVE_UID] (state, uid) {
        state.uid = uid
    }
}
