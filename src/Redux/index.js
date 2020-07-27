import {combineReducers} from 'redux';

import progressReducer from './progress.reducer';
import channelsReducer from './channels.reducer';

const rootReducer = combineReducers({
    progressReducer,
    channelsReducer
});

export default rootReducer;