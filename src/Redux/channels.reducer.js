function Channel(index) {
    this.name = `channel_${index}`;
    this.colors = ['#ffffff'];
    this.img_url = '';
}

const reducer = (state=[new Channel(0)], action)=>{
    switch(action.type) {
        default: return state;
        case 'SET_CHANNELS': return action.payload;
        case 'RESET_CHANNELS': return [new Channel(0)];
        case 'ADD_CHANNEL': return [...state, new Channel(state.length)];
        case 'REMOVE_CHANNEL':
            let removeChannelCopy = [...state];
            removeChannelCopy.splice(action.payload,1);
            return removeChannelCopy;
        case 'SET_CHANNEL_NAME':
            let channelCopy = [...state];
            channelCopy[action.payload.index].name = action.payload.name;
            return channelCopy;
        case 'SET_CHANNEL_IMG':
            let setImgCopy = [...state];
            setImgCopy[action.payload.index].img_url = action.payload.img_url;
            return setImgCopy;
        case 'UPDATE_COLOR':
            let updateColorCopy = [...state];
            updateColorCopy[action.payload.channelIndex].colors[action.payload.colorIndex] = action.payload.color;
            return updateColorCopy;
    }
}

export default reducer;