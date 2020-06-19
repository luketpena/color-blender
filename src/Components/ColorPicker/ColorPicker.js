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
}))`    
    width: 250px;
    height: 100px;`;
    


export default function ColorPicker() {

    const [myCol, setMyCol] = useState('#000000');

    useEffect(()=>{
        var colorPicker = new iro.ColorPicker('#picker');
        colorPicker.on('color:change', function(color) {
            setMyCol(color.hexString)
        })
    },[])
   

    return (
        <Container>
            <ColorBox color={blend('#FF0000',myCol,1)} />
            <div id="picker"></div>
        </Container>
    )
}