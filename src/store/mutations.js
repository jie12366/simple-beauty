import {
    RECORD_TOKEN,
    SAVE_HEAD_IMG,
    SAVE_UID,
    SAVE_ACCOUNT
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
    },
    // 记录用户账号
    [SAVE_ACCOUNT] (state, account) {
        state.account = account
    }
}
