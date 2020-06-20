import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import iro from '@jaames/iro';

import blend from '../../Modules/blend';

const Container = styled.div`
    width: 256px;
    background-color: #222;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 16px 32px -16px ${props=>props.color}55;
    margin: 16px 24px;
`;

const ColorBox = styled.div.attrs(props=>({
    style: {
        backgroundColor: props.color,
    },
}))`width: 250px;
    height: 16px;
    border-radius: 8px;
    margin: 8px 0;
    `;

const ColorListBox = styled.div`
    margin: 16px 0;
    padding: 4px;
    border-radius: 8px;
    background-color: #111;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const ColorButton = styled.button.attrs(props=>({
    style: {
        backgroundColor: props.color,
        
    },
}))`
    height: 24px;
    width: 24px;
    outline: none;
    border-radius: 50%;
    margin: 4px;
    transition: transform .2s;
    cursor: pointer;
    border: ${props=>(props.selected? '2px solid white' : '2px solid rgba(0,0,0,0)')};
    transform: scale(${props=>(props.selected? '1.5' : '1.0')});
`;

export default function ColorPicker(props) {

    const dispatch = useDispatch();

    const progress = useSelector(state=>state.progressReducer);
    const channels = useSelector(state=>state.channelsReducer);
    const channel = useSelector(state=>state.channelsReducer[props.index]);

    const [selectedColor, setSelectedColor] = useState('#000000');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [mounted, setMounted] = useState(false);

    const pickerId = `picker${props.index}`;

    useEffect(()=>{
        var colorPicker = new iro.ColorPicker(`#${pickerId}`,{width: 256});
        colorPicker.on('color:change', color=> {
            setSelectedColor(color.hexString);
        });
    },[]);

    useEffect(()=>{
        if (selectedIndex!==-1) {
            saveColor(selectedIndex);
        }
    },[selectedColor]);

    useEffect(()=>{
        if (mounted) {
            setSelectedColor(channel[channel.length-1]);
            setSelectedIndex(channel.length-1);
        } else setMounted(true);
    },[channel.length])
   
    function renderColorList() {
        return channel.map((color,i)=>{
            return <ColorButton key={i} color={(i===selectedIndex? selectedColor : color)} selected={i===selectedIndex} onClick={()=>selectColor(i,color)}/>
        })
    }

    function selectColor(i,color) {
        if (selectedIndex!==i) {
            if (selectedIndex!==-1) {
                saveColor(selectedIndex);
            }
            setSelectedIndex(i);
            setSelectedColor(color);
        } else {
            setSelectedIndex(-1);
            saveColor(i);
        }
    }

    function saveColor(i) {
        var channelCopy = [...channel];
        channelCopy[i] = selectedColor;

        var listCopy = [...channels];
        listCopy[props.index] = channelCopy;

        dispatch({type: 'SET_CHANNELS', payload: listCopy});
    }

    function addColor() {
        var channelCopy = [...channel,'#FFF'];

        var listCopy = [...channels];
        listCopy[props.index] = channelCopy;
        dispatch({type: 'SET_CHANNELS', payload: listCopy});
    }

    function removeColor() {
        if (selectedIndex!==-1) {
            var channelCopy = [...channel];
            channelCopy.splice(selectedIndex,1);

            var listCopy = [...channels];
            listCopy[props.index] = channelCopy;
            dispatch({type: 'SET_CHANNELS', payload: listCopy});
        }
    }

    function getBlendedColor() {
        switch(channel.length) {
            case 0: return '#FFFFFF';
            case 1: return channel[0];
            default:
                let currentUnit = Math.floor((channel.length) * progress);
                currentUnit = Math.min(currentUnit, channel.length-1); 
                

                let color1 = ''; 
                let color2 = '';

                if (currentUnit===channel.length-1) {
                    color1 = channel[channel.length-1];
                    color2 = channel[0];
                } else {
                    color1 = channel[currentUnit];
                    color2 = channel[currentUnit+1];
                }

                let localProgress = Math.min((channel.length) * progress, channel.length-.01) % 1;             
                return blend(color1,color2,localProgress);
        }
    }

    return (
        <Container onMouseLeave={()=>setSelectedIndex(-1)} color={getBlendedColor()}>
            <button className="btn btn-center btn-active" onClick={addColor}>Add Color</button>
            <ColorListBox>
                {renderColorList()}
            </ColorListBox>
            <button className={`btn btn-center ${(selectedIndex===-1? 'btn-disabled' : 'btn-active')}`} onClick={removeColor}>Remove Color</button>
            <ColorBox color={getBlendedColor()} />
            <div id={pickerId}></div>
        </Container>
    )
}