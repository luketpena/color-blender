const reducer = (state=[
    {
        name: '',
        colors: ['#F00','#0F0','#F0F'],
    }
    
], action)=>{
    switch(action.type) {
        default: return state;
        case 'SET_CHANNELS': return action.payload;
        case 'ADD_CHANNEL': return [...state, ['#FFF']];
        case 'SET_CHANNEL_NAME':
            let channelCopy = [...state];
            channelCopy[action.payload.index].name = action.payload.name;
            return channelCopy;
    }
}

export default reducer;