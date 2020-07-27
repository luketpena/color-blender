import React from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';

import ColorPicker from '../ColorPicker/ColorPicker';
import ProgressControl from '../ProgressControl/ProgressControl';
import Menu from '../Menu/Menu';

const ChannelBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 32px;
`;

export default function App() {

  //Setup
  const dispatch = useDispatch();
  const channels = useSelector(state=>state.channelsReducer);

  //Renders the individual channel controls
  function renderChannels() {
    return channels.map( (channel,i)=>{
      return <ColorPicker key={i} channel={channel} index={i} />
    });
  }

  //Adds a new channel to the list
  function addChannel() {
    dispatch({type: 'ADD_CHANNEL'});
  }

  return (
    <div>
      <Menu />
      <ProgressControl />
      <button className="btn btn-center btn-active" onClick={addChannel}>Add Channel</button>
      
      <ChannelBox>
        {renderChannels()}
      </ChannelBox>
    </div>
  )
}
