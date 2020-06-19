import React from 'react';
import styled from 'styled-components';

import blend from '../../Modules/blend';

const Container = styled.div`

`;

const ColorBox = styled.div`
    width: 250px;
    height: 100px;
    background-color: ${props=>props.color};
`;

export default function ColorPicker() {
    return (
        <Container>
            <ColorBox color={blend('#FF0000','#0000FF',1)} />
        </Container>
    )
}