import {combineReducers} from 'redux';

/* import reducers here */
import progressReducer from './progress.reducer';
import channelsReducer from './channels.reducer';

const rootReducer = combineReducers({
    //List reducers separated by comma
    progressReducer,
    channelsReducer
});

export default rootReducer;