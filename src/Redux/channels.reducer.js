//This is the template for a channel
function Channel(index) {
    this.name = `channel_${index}`;
    this.colors = ['#ffffff'];
    this.img_url = '';
    this.img_active = false;
}

/*
  This reducer holds an array of Channel instances that contain all of the info
  for a given channel about its colors, image, and name.
*/
const reducer = (state=[new Channel(0)], action)=>{
    switch(action.type) {
        default: return state;
        case 'SET_CHANNELS': return action.payload;
        case 'RESET_CHANNELS': return [new Channel(0)];
        case 'ADD_CHANNEL': return [...state, new Channel(state.length)];
        case 'REMOVE_CHANNEL':
            //Targets a channel based on index
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
        case 'SET_CHANNEL_IMG_ACTIVE':
            let setImgActiveCopy = [...state];
            setImgActiveCopy[action.payload.index].img_active = action.payload.img_active;
            return setImgActiveCopy;
        case 'UPDATE_COLOR':
            let updateColorCopy = [...state];
            updateColorCopy[action.payload.channelIndex].colors[action.payload.colorIndex] = action.payload.color;
            return updateColorCopy;

        case 'ADD_COLOR':
            let addColorCopy = [...state];
            addColorCopy[action.payload.channelIndex].colors.push('#fff');
            return addColorCopy;

        case 'REMOVE_COLOR':
          let removeColorCopy = [...state];
          removeColorCopy[action.payload.channelIndex].colors.splice(action.payload.colorIndex,1);
          return removeColorCopy;
    }
}

export default reducer;