import {
    RECORD_TOKEN
} from './mutation-types'
export default {
    // 记录token
    [RECORD_TOKEN] (state, token) {
        state.token = token
        localStorage.setItem('token', token)
    }
}
