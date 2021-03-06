//This reducer simply tracks the progress of the animation bar

const reducer = (state=.5, action)=>{
    switch(action.type) {
        case 'SET_PROGRESS': return action.payload;
        default: return state;
    }
}

export default reducer;