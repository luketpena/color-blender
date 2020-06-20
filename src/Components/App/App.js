import React from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';

import ColorPicker from '../ColorPicker/ColorPicker';
import ProgressControl from '../ProgressControl/ProgressControl';

const ChannelBox = styled.div``;

export default function App() {

  const dispatch = useDispatch();

  const channels = useSelector(state=>state.channelsReducer);

  function renderChannels() {
    return channels.map( (channel,i)=>{
      return <ColorPicker key={i} channel={channel} index={i} />
    });
  }

  function addChannel() {
    dispatch({type: 'ADD_CHANNEL'});
  }

  return (
    <div>
      <ProgressControl />
      <button className="btn btn-center" onClick={addChannel}>Add Channel</button>
      <ChannelBox>
        {renderChannels()}
      </ChannelBox>
    </div>
  )
}
