// store.js
import { createStore } from "vuex"; // 导入 Vuex 中的 createStore 函数
import createPersistedState from "vuex-persistedstate"; // 导入 createPersistedState 函数

// 创建 Vuex store
const store = createStore({
  state() {
    return {
      userId: "", //用户id
      userRole: "", // 用户角色
      // 在这里定义你的 state
    };
  },
  mutations: {
    // 在这里定义你的 mutations
    setUserRole(state, role) {
      state.userRole = role;
      /* localStorage.setItem('userRole', role); */
    },
    setUserId(state, id) {
      state.userId = id;
      /* localStorage.setItem('userRole', role); */
    },
  },
  actions: {
    // 在这里定义你的 actions
  },
  getters: {
    getUserRole(state) {
      return state.userRole;
    },
    getUserId(state) {
      return state.userId;
    },
  },
  plugins: [
    createPersistedState({
      key: "your-app-storage-key", // 设置一个存储键名
    }), // 使用 createPersistedState 插件
  ],
});

export default store;

// export default new Vuex.Store({
//   state: {

//   },
//   mutations: {
//     setUserRole(state, role) {
//       state.userRole = role;
//       /* localStorage.setItem('userRole', role); */
//     },
//     setUserId(state, id) {
//       state.userId = id;
//       /* localStorage.setItem('userRole', role); */
//     },
//   },
//   getters: {
//     getUserRole(state) {
//       return state.userRole;
//     },
//     getUserId(state) {
//       return state.userId;
//     },
//   },
//   // 持久化插件
//   plugins: [
//     createPersistedState({
//       key: "your-app-storage-key", // 设置一个存储键名
//     }),
//   ],
// });
