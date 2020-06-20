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

    .in-name {
        width: 100%;
        margin-bottom: 16px;
        background: none;
        outline: none;
        border: none;
        border-bottom: 1px solid #333;
        color: #BBB;
    }
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
    const colorList = useSelector(state=>state.channelsReducer[props.index].colors);

    const [selectedColor, setSelectedColor] = useState('#000000');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState('');

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
            setSelectedColor(colorList[colorList.length-1]);
            setSelectedIndex(colorList.length-1);
        } else setMounted(true);
    },[colorList.length])
   
    function renderColorList() {
        return colorList.map((color,i)=>{
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

    function changeName(event) {
        let string = event.target.value;
        if (string.charAt(string.length-1)!==' ') {
            dispatch({type: 'SET_CHANNEL_NAME', payload: {index: props.index, name: event.target.value}})
        }
    }

    function saveColor(i) {
        var channelCopy = {...channel};
        channelCopy.colors[i] = selectedColor;

        updateChannel(channelCopy);
    }

    function addColor() {
        var channelCopy = {...colorList};
        channelCopy.colors.push('#FFF');

        updateChannel(channelCopy);
    }

    function removeColor() {
        if (selectedIndex!==-1) {
            var channelCopy = {...colorList};
            channelCopy.colors.splice(selectedIndex,1);

            updateChannel(channelCopy);
        }
    }

    function updateChannel(newVersion) {
        var listCopy = [...channels];
        listCopy[props.index] = newVersion;
        dispatch({type: 'SET_CHANNELS', payload: listCopy});
    }

    function getBlendedColor() {
        switch(colorList.length) {
            case 0: return '#FFFFFF';
            case 1: return colorList[0];
            default:
                let currentUnit = Math.floor((colorList.length) * progress);
                currentUnit = Math.min(currentUnit, colorList.length-1); 
                

                let color1 = ''; 
                let color2 = '';

                if (currentUnit===colorList.length-1) {
                    color1 = colorList[colorList.length-1];
                    color2 = colorList[0];
                } else {
                    color1 = colorList[currentUnit];
                    color2 = colorList[currentUnit+1];
                }

                let localProgress = Math.min((colorList.length) * progress, colorList.length-.01) % 1;             
                return blend(color1,color2,localProgress);
        }
    }

    return (
        <Container onMouseLeave={()=>setSelectedIndex(-1)} color={getBlendedColor()}>
            <input 
                type="text" 
                className="in-name"
                placeholder="channel_name" 
                value={channel.name} 
                onChange={event=>changeName(event)}
            />
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