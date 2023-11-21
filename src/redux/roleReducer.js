const roleInitialState = JSON.parse(localStorage.getItem('myAppState')) || {
    user: null,
};

export const ADD_USER_DATA = 'ADD_USER_DATA'

export const roleReducer = (state = roleInitialState, action) => {
    switch (action.type) {
    case ADD_USER_DATA:
        return {...state, user: action.payload };
    default:
        return state;
    }
};