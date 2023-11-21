import { createStore,combineReducers } from 'redux';
import { hideReducer } from './hideReducer';
import { roleReducer } from './roleReducer';

const initialState = JSON.parse(localStorage.getItem('myAppState')) || {
    isHidden:{
        isHidden: false
    },
    user: {
        user: null
    }
};

const rootReducer = combineReducers({
    isHidden: hideReducer,
    user: roleReducer,
});

const store = createStore(rootReducer,initialState);

store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('myAppState', JSON.stringify(state));
});

export default store;