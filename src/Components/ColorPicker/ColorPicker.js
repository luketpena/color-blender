import React, {useState, useEffect} from 'react';
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

    const [selectedColor, setSelectedColor] = useState('#000000');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [colorList, setColorList] = useState(['#FFF']);

    useEffect(()=>{
        var colorPicker = new iro.ColorPicker('#picker');
        colorPicker.on('color:change', color=> {
            setSelectedColor(color.hexString);
        });
    },[]);

    
   
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

    return (
        <Container>
            {renderColorList()}
            {selectedIndex}
            <button onClick={addCell}>+</button>
            <ColorBox color={blend('#FF0000',colorList[0],1)} />
            <div id="picker"></div>
        </Container>
    )
}