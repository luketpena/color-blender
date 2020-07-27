import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import iro from '@jaames/iro';

import blend from '../../Modules/blend';

//#region Styling
const Container = styled.div`
    width: max-content;
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

    .in-name, .in-colorHex, .in-imgUrl {
        width: 100%;
        margin-bottom: 16px;
        background: none;
        outline: none;
        border: none;
        border-bottom: 1px solid #333;
        color: #BBB;
    }

    .in-colorHex {
        margin-top: 16px;
        text-align: center;
    }
`;

const ColorBox = styled.div.attrs(props=>({
    style: {
        backgroundColor: props.color,
    },
}))`width: 250px;
    height: 24px;
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

const ModeBox = styled.div`
    margin-bottom: 16px;
    .active {
        cursor: pointer;
        &:hover {
            transform: scale(1.1);
            opacity: 1;
            z-index: 10;
        }
    }
`;

const ModeButton = styled.button`
    width: 50%;
    border: none;
    outline: none;
    background-color: ${props=>(props.active? '#444' : '#333')};
    padding: 4px 0;
    opacity: .9;
    color: ${props=>(props.active? '#AAA' : '#888')};
    transition: all .1s;
    position: relative;
`;

//#endregion

export default function ColorPicker(props) {

    //#region Setup
        const dispatch = useDispatch();

        /*--------< REDUCERS >--------*/
        const progress = useSelector(state=>state.progressReducer);
        const channel = useSelector(state=>state.channelsReducer[props.index]);
        const colorList = useSelector(state=>state.channelsReducer[props.index].colors);

        /*--------< STATES >--------*/
        const [selectedColor, setSelectedColor] = useState('#000000');
        const [selectedIndex, setSelectedIndex] = useState(-1);
        const [mounted, setMounted] = useState(false);
        const [colorPicker, setColorPicker] = useState(null);
        const [colorHex, setColorHex] = useState('')
        const [imgActive, setImgActive] = useState(false);

        //This is used to generate a unique color wheel to this component
        const pickerId = `picker${props.index}`;
    //#endregion

    //#region useEffects
        //This useEffect initiates the color picker on first render and sets up the listener
        useEffect(()=>{
            var colorPickerInst = new iro.ColorPicker(`#${pickerId}`,{width: 256});
            colorPickerInst.on('color:change', color=> {
                setSelectedColor(color.hexString);
            });
            setColorPicker(colorPickerInst);           
        },[]);
        
        //This useEffect updates the saved color if a color on a channel is selected
        useEffect(()=>{
            setColorHex(selectedColor);
            if (selectedIndex!==-1) {
                saveColor(selectedIndex);     
            }
        },[selectedColor]);

        //This useEffect watches for when a new color is added and then auto-selects that color
        useEffect(()=>{
            if (mounted) {
                setSelectedColor(colorList[colorList.length-1]);
                setSelectedIndex(colorList.length-1);
            } else setMounted(true);
        },[colorList.length])
    //#endregion

    //#region Methods

    //Draws all of the color circle-buttons
    function renderColorList() {
        return colorList.map((color,i)=>{
            return <ColorButton key={i} color={(i===selectedIndex? selectedColor : color)} selected={i===selectedIndex} onClick={()=>selectColor(i,color)}/>
        })
    }

    function renderModeDisplay() {
        switch(imgActive) {
            case true: 
                return <input 
                            type="text" 
                            placeholder="Image URL" 
                            className="in-imgUrl"
                            value={channel.img_url}
                            onChange={e=>{
                                    let newImg = {
                                        index: props.index,
                                        img_url: e.target.value
                                    }
                                    dispatch({type: 'SET_CHANNEL_IMG', payload: newImg})
                                }
                            }
                        />
            case false: return <ColorBox color={getBlendedColor()} />;
        }
    }

    function selectColor(i,color) {
        if (selectedIndex!==i) {
            if (selectedIndex!==-1) {
                saveColor(selectedIndex);
            }
            setSelectedIndex(i);
            setSelectedColor(color);
            colorPicker.color.hexString = color;
            //setColorHex(color);
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
    
    //This function targets a channel by index and a color within that channel by index to update.
    function saveColor(i) {
        let newColor = {
            channelIndex: props.index,
            colorIndex: i,
            color: selectedColor,
        }
        dispatch({type: 'UPDATE_COLOR', payload: newColor});
    }

    //Adds a new blank color, defaults to white
    function addColor() {
        dispatch({type: 'ADD_COLOR', payload: {channelIndex: props.index} })
    }

    //Removes a color from the channel, targeting by indices
    function removeColor() {
        if (selectedIndex!==-1) {
          dispatch({type: 'REMOVE_COLOR', payload: {
            channelIndex: props.index,
            colorIndex: selectedIndex
          }});
        }
    }

    //Deletes the entire channel
    function removeChannel() {
        let q = window.confirm("Do you want to remove this channel?");
        if (q) {
            dispatch({type: 'REMOVE_CHANNEL', payload: props.index})
        }
    }

    /*
      This function returns the color interpolated throughout the loop of colors based on the 
      position of the global progress bar
    */
    function getBlendedColor() {
        switch(colorList.length) {
            case 0: return '#FFFFFF';
            case 1: return colorList[0];
            default:
                //Figure out which step we are currently on
                let currentUnit = Math.floor((colorList.length) * progress);
                currentUnit = Math.min(currentUnit, colorList.length-1); 
                
                //Set blank colors
                let color1 = ''; 
                let color2 = '';

                //Determine which two colors should be used
                if (currentUnit===colorList.length-1) {
                    //When on the final color, loop to the first color
                    color1 = colorList[colorList.length-1];
                    color2 = colorList[0];
                } else {
                    //Use the currentUnit and the upcoming unit
                    color1 = colorList[currentUnit];
                    color2 = colorList[currentUnit+1];
                }

                //Use *math* to find out the progress within the current step using modulo
                let localProgress = Math.min((colorList.length) * progress, colorList.length-.01) % 1;             
                return blend(color1,color2,localProgress);
        }
    }

    //Updates the color based on the typed hex value
    function handleColorHexChange(event) {
        let color = event.target.value;

        //Prevent the hex code from losing its hex
        if (color!=='') {
            setColorHex(color);
            setSelectedColor(color);
            
            //Only set the color picker a legitimate hex code
            if (color.charAt(0)==='#' && color.length===7) {
                colorPicker.color.hexString = color;
            }
        }
    }

    function toggleImg(value) {
        setImgActive(value);
        dispatch({type: 'SET_CHANNEL_IMG_ACTIVE', payload: {index: props.index, img_active: imgActive}})
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
            {renderModeDisplay()}
            <ModeBox>
                <ModeButton className={`${(imgActive? 'active' : '')}`} active={imgActive} onClick={()=>toggleImg(false)}>Block</ModeButton>
                <ModeButton className={`${(!imgActive? 'active' : '')}`} active={!imgActive} onClick={()=>toggleImg(true)}>Image</ModeButton>
            </ModeBox>
            <PickerBox id={pickerId}></PickerBox>
            <input 
                type="text"
                className="in-colorHex"
                value={colorHex}
                onChange={event=>handleColorHexChange(event)}
            />
        </Container>
    )
}