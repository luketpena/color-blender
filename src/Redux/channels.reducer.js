const reducer = (state=[
    ['#F00','#0F0','#F0F']
], action)=>{
    switch(action.type) {
        default: return state;
        case 'SET_CHANNELS': return action.payload;
        case 'ADD_CHANNEL': return [...state, ['#FFF']];
    }
}

export default reducer;