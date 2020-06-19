import React from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';

const ProgressSlider = styled.input`
    width: 100%;
`;

export default function ProgressControl() {

    const dispatch = useDispatch();
    const progress = useSelector(state=>state.progressReducer);

    function handleProgressChange(event) {
        console.log(event.target.value);
        dispatch({type: 'SET_PROGRESS', payload: event.target.value})
    }

    return (
        <div>
            <ProgressSlider value={progress} type="range" min="0" max="1" step="0.01" onChange={event=>handleProgressChange(event)}/>
        </div>
    )
}