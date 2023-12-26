const initialState = JSON.parse(localStorage.getItem('myAppState')) || []

const LIKES_MANAGER = 'LIKES_MANAGER';

export const likesReducer = (state = initialState, action) => {
    switch (action.type) {
    case LIKES_MANAGER:
        return action.payload;
    default:
        return state;
    }
};