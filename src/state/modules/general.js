export const state = {
  expandedSideNavBar: false,
}

export const mutations = {
  SET_EXPAND_SIDE_NAV_BAR(state, newValue) {
    state.expandedSideNavBar = newValue
  },
}

export const getters = {
  expandedSideNavBar(state) {
    return state.expandedSideNavBar
  },
}

export const actions = {
  expandSideNavBar(state, payload) {
    state.commit('SET_EXPAND_SIDE_NAV_BAR', payload)
  },
}
