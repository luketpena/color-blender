import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretUp, faCaretDown} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Container = styled.div`
    background-color: black;
    height: ${props=>(props.active? '50vh' : '32px')};
    width: 100%;
    position: relative;

    transition: height .4s;

    .activator {
        color: #DDD;
        position: absolute;
        right: 32px;
        bottom: 0;
        font-size: 32px;
        cursor: pointer;
        transition: all .2s;
        &:hover {
            color: white;
            transform: scale(1.1);
        }
    }
`;

const Layer = styled.img`
    height: 100%;
    width: auto;
    position: absolute;
`;

export default function Viewer() {

    const [active, setActive] = useState(true);
    const channels = useSelector(state=>state.channelsReducer);

    function renderImages() {
    }

    return (
        <Container active={active}>
            <FontAwesomeIcon className="activator" icon={(active? faCaretUp : faCaretDown)} onClick={()=>setActive(!active)}/>
            {renderImages()}
        </Container>
    )
}