const hideInitialState = JSON.parse(localStorage.getItem('myAppState')) || {
    isHidden: false,
};

export const IS_HIDDEN = 'IS_HIDDEN'

export const hideReducer = (state = hideInitialState, action) => {
    switch (action.type) {
    case IS_HIDDEN:
        return {...state, isHidden: action.payload };
    default:
        return state;
    }
};