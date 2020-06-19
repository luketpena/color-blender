import React from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';

import ColorPicker from '../ColorPicker/ColorPicker';
import ProgressControl from '../ProgressControl/ProgressControl';

const ChannelBox = styled.div``;

export default function App() {

  const channels = useSelector(state=>state.channelsReducer);

  function renderChannels() {
    return channels.map( (channel,i)=>{
      return <ColorPicker key={i} channel={channel} index={i} />
    });
  }

  return (
    <div>
      <ProgressControl />
      <ChannelBox>
        {renderChannels()}
      </ChannelBox>
    </div>
  )
}
