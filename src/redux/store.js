import { createStore,combineReducers } from 'redux';
import { dislikesReducer } from './dislikesReducer';
import { hideReducer } from './hideReducer';
import { likesReducer } from './likesReducer';
import { roleReducer } from './roleReducer';

const initialState = JSON.parse(localStorage.getItem('myAppState')) || {
    isHidden:{
        isHidden: false
    },
    user: {
        user: null
    },
    likes: [],
    dislikes: []
};

const rootReducer = combineReducers({
    isHidden: hideReducer,
    user: roleReducer,
    likes: likesReducer,
    dislikes: dislikesReducer
});

const store = createStore(rootReducer,initialState);

store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('myAppState', JSON.stringify(state));
});

export default store;