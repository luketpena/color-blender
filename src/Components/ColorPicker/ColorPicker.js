import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import iro from '@jaames/iro';

import blend from '../../Modules/blend';

const Container = styled.div`

`;

const ColorBox = styled.div.attrs(props=>({
    style: {
        backgroundColor: props.color,
    },
}))`width: 250px;
    height: 100px;`;
    
const ColorButton = styled.button.attrs(props=>({
    style: {
        backgroundColor: props.color,
        border: (props.selected? '1px solid red' : '1px solid rgba(0,0,0,0)')
    },
}))`
    height: 24px;
    width: 24px;
    outline: none;
    border-radius: 50%;
`;

export default function ColorPicker() {

    const progress = useSelector(state=>state.progressReducer);

    const [blendedColor, setBlendedColor] = useState('#000000');
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [colorList, setColorList] = useState(['#F00','#0F0','#00F']);

    useEffect(()=>{
        var colorPicker = new iro.ColorPicker('#picker');
        colorPicker.on('color:change', color=> {
            setSelectedColor(color.hexString);
        });
    },[]);

    useEffect(()=>{
        if (selectedIndex!==-1) {
            saveColor(selectedIndex);
        }
    },[selectedColor]);

    
   
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

    function saveColor(i) {
        var colorListCopy = [...colorList];
        colorListCopy[i] = selectedColor;
        setColorList(colorListCopy);
    }

    function addCell() {
        setColorList([...colorList,'#FFF']);
    }

    function getBlendedColor() {
        switch(colorList.length) {
            case 0: return '#FFFFFF';
            case 1: return colorList[0];
            case 2: return blend(colorList[0],colorList[1],progress);
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
                console.log(currentUnit);
                

                return blend(color1,color2,localProgress);
        }
    }

    return (
        <Container>
            {renderColorList()}
            {selectedIndex}
            <button onClick={addCell}>+</button>
            <ColorBox color={getBlendedColor()} />
            {getBlendedColor()}
            <div id="picker"></div>
        </Container>
    )
}