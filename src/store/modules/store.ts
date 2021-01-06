import { userOverview } from '@/api/lib/user';
import { GET_STORE_INFO } from '../mutation_type';
import Taro from '@tarojs/taro';
import { GetterTree, ActionTree } from 'vuex';

const state = {
    data: {}
};

const getters: GetterTree<any, any> = {
    store: ({ data }) => data.store || {},
    storeType: ({ data }) => {
        const { store = {} } = data;
        return store.type;
    },
    role: ({ data }) => data.role || {},
    user: ({ data }) => data.user || {},
    storeId: ({ data }) => data.store ? data.store.id : '',
    subId: ({ data }) => data.sub_id,
    account: ({ data }) => {
        return data.account || {};
    },
    serviceman: ({ data }) => data.serviceman || {},
    Setting: ({ data }) => data.Setting || {},
    data: ({ data }) => data.account ? data : {user: {}, store: {}, account: {}, serviceman: {}, Setting: {}}
};

/**
 * 同步操作
 */
const mutations = {
    [GET_STORE_INFO] (state: { data: {}; }, {data = {}}) {
        state.data = data;
    }
};

let sync = false;

/**
 * 异步操作
 */
const actions: ActionTree<any, any> = {
    refresh ({ state, commit }) {
        if (!Taro.getStorageSync('token') || sync) {
            return;
        }

        // 获取登录账户信息
        return userOverview({}).then((data) => {
            // 处理数据
            commit({
                type: GET_STORE_INFO,
                data
            });

            return data;
        }).catch(() => {
            state.cartLoaded = true;
        });
    },
    clear ({ commit }) {
        // 清空
        commit({ type: GET_STORE_INFO, data: {} });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
