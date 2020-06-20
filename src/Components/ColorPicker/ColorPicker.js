import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import iro from '@jaames/iro';

import blend from '../../Modules/blend';

//#region Styling
const Container = styled.div`
    width: 256px;
    background-color: #222;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #333;
    box-shadow: 0 16px 32px -16px black;
    margin: 16px 24px;
    position: relative;

    .delete-btn {
        position: absolute;
        right: 16px;
        top: 16px;
        color: #555;
        cursor: pointer;
        transition: color .2s;
        &:hover {
            color: #AAA;
        }
    }

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

const PickerBox = styled.div`
    cursor: pointer;
`;
//#endregion

export default function ColorPicker(props) {

    //#region Setup
    const dispatch = useDispatch();

    /*--------< REDUCERS >--------*/
    const progress = useSelector(state=>state.progressReducer);
    const channels = useSelector(state=>state.channelsReducer);
    const channel = useSelector(state=>state.channelsReducer[props.index]);
    const colorList = useSelector(state=>state.channelsReducer[props.index].colors);

    /*--------< STATES >--------*/
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [mounted, setMounted] = useState(false);
    const [colorPicker, setColorPicker] = useState(null);

    //This is used to generate a unique color wheel to this component
    const pickerId = `picker${props.index}`;
    //#endregion

    //#region Effects
    useEffect(()=>{
        var colorPickerInst = new iro.ColorPicker(`#${pickerId}`,{width: 256});
        colorPickerInst.on('color:change', color=> {
            setSelectedColor(color.hexString);
        });
        setColorPicker(colorPickerInst);
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
    //#endregion

    //#region Methods
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
            colorPicker.color.hexString = color;
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
        let newColor = {
            channelIndex: props.index,
            colorIndex: i,
            color: selectedColor,
        }
        dispatch({type: 'UPDATE_COLOR', payload: newColor});
    }

    function addColor() {
        var channelCopy = {...channel};
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

    function removeChannel() {
        let q = window.confirm("Do you want to remove this channel?");
        if (q) {
            dispatch({type: 'REMOVE_CHANNEL', payload: props.index})
        }
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
    //#endregion

    return (
        <Container onMouseLeave={()=>setSelectedIndex(-1)}>
            <FontAwesomeIcon className="delete-btn" icon={faTimes} onClick={removeChannel}/>
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
            <PickerBox id={pickerId}></PickerBox>
        </Container>
    )
}