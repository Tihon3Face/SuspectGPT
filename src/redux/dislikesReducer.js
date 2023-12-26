const initialState = JSON.parse(localStorage.getItem('myAppState')) || []

const DISLIKES_MANAGER = 'DISLIKES_MANAGER';

export const dislikesReducer = (state = initialState, action) => {
    switch (action.type) {
    case DISLIKES_MANAGER:
        return action.payload;
    default:
        return state;
    }
};