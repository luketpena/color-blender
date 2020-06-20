import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlayCircle, faPauseCircle, faWalking, faBicycle, faCarSide, faPlane } from '@fortawesome/free-solid-svg-icons';

const ProgressSlider = styled.input`
    width: 100%;
`;

const PlayBox = styled.div`
    margin: 16px auto;
    display: flex;
    justify-content: center;
    align-items: center;    
    
    #play {
        font-size: 48px;
        color: white;
        cursor: pointer;
        transition: transform .2s;
        margin-right: 16px;
        &:hover {
            transform: scale(1.2);
        }
    }
    
`;

const SpeedList = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
        font-size: 24px;
        display: block;
        height: 32px;
        margin: 4px;    
        cursor: pointer;
    }
`;

const SpeedIcon = styled.div`
    color: ${(props=> (props.selected===props.index? 'white' : 'gray') )};
    transition: transform .2s;
    &:hover {
        transform: scale(1.2);
    }
`;

const speedList = [
    .0001,
    .001,
    .0025,
    .005
]

export default function ProgressControl() {

    const dispatch = useDispatch();
    const progress = useSelector(state=>state.progressReducer);

    const [play, setPlay] = useState(false);
    const [localProgress, setLocalProgress] = useState(progress);
    const [speed, setSpeed] = useState(0);

    useEffect(()=>{
        const interval = setInterval(()=>{
            if (play) setLocalProgress(progress => (progress+speedList[speed]) % 1);

        },10);
        return ()=> clearInterval(interval);
    },[play, speed]);

    useEffect(()=>{
        dispatch({type: 'SET_PROGRESS', payload: localProgress});        
    },[localProgress])


    function handleProgressChange(event) {
        dispatch({type: 'SET_PROGRESS', payload: event.target.value})
    }

    return (
        <div>
            <ProgressSlider value={progress} type="range" min="0" max="1" step="0.001" onChange={event=>handleProgressChange(event)}/>

            <PlayBox>
                <div>
                    <FontAwesomeIcon id="play" icon={(play? faPauseCircle : faPlayCircle)} onClick={()=>setPlay(!play)}/>
                </div>
                <SpeedList>
                    <SpeedIcon index={0} selected={speed} onClick={()=>setSpeed(0)}><FontAwesomeIcon className="icon" icon={faWalking}/></SpeedIcon>
                    <SpeedIcon index={1} selected={speed} onClick={()=>setSpeed(1)}><FontAwesomeIcon className="icon" icon={faBicycle}/></SpeedIcon>
                    <SpeedIcon index={2} selected={speed} onClick={()=>setSpeed(2)}><FontAwesomeIcon className="icon" icon={faCarSide}/></SpeedIcon>
                    <SpeedIcon index={3} selected={speed} onClick={()=>setSpeed(3)}><FontAwesomeIcon className="icon" icon={faPlane}/></SpeedIcon>
                </SpeedList>
            </PlayBox>
        </div>
    )
}