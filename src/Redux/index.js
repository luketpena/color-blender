import {combineReducers} from 'redux';

/* import reducers here */
import progressReducer from './progress.reducer';

const rootReducer = combineReducers({
    //List reducers separated by comma
    progressReducer
});

export default rootReducer;