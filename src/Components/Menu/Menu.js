import React, {useRef} from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import {saveAs} from 'file-saver';

const MenuBar = styled.div`
    background-color: #222;
    margin: 0;
    height: 32px;
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 0 16px;
    button, input {
        margin: 0;
    }

    #file, #load-file {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }

    .menu-item {
        background: none;
        height: 32px;
        line-height: 32px;
        padding: 0 32px;
        margin-right: 2px;
        border: none;
        outline: none;
        color: #777;
        font-weight: normal;
        font-family: monospace;

        cursor: pointer;
        transition: all .2s;

        &:hover {
            background-color: #333;
            color: #888;
        }
    }
`;

const hexRegExp = /^#[0-9A-F]{6}$/i; 

export default function Menu() {

    const dispatch = useDispatch();

    const channels = useSelector(state=>state.channelsReducer);

    const importRef = useRef(null);
    const loadRef = useRef(null);

    function exportFile() {
        let text = '';

        for (let channel of channels) {
            text += `${channel.name} = [${channel.colors.toString()}];\n`;
        }

        let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob,"palette.txt");
    }

    function resetChannels() {
        let q = window.confirm('Are you sure you want to reset all channels?');
        if (q) {
            dispatch({type: 'RESET_CHANNELS'})
        }
    }

    let fileReader;

    function handleFileImport(event) {
        const file = event.target.files[0];
        fileReader = new FileReader();
        fileReader.onloadend = readFile;
        fileReader.readAsText(file);
    }

    function readFile(e) {
        const content = fileReader.result;
        console.log(content);
        interpretPalleteImport(content);
    }

    function interpretPalleteImport(content) {
        let contentArray = content.replace( /\r\n|\n|\r/gm, '' ).split(';');
        contentArray.pop();

        let validColors = true;

        for (let i=0; i<contentArray.length; i++) {
            contentArray[i] = contentArray[i].split(' = ');

            if (contentArray[i].length!==2) break;

            contentArray[i] = {
                name: contentArray[i][0],
                colors: contentArray[i][1].replace( /\[|\]/g, '').split(',')
            }  
        }

        for (let i=0; i<contentArray.length; i++) {
            
            if (Array.isArray(contentArray[i].colors)) {
                for (let color of contentArray[i].colors) {
                    if (!hexRegExp.test(color)) validColors = false;
                }
            } else {
                validColors = false;
            }
        }

        if (contentArray.length===0) validColors = false;


        console.log(contentArray);
        console.log((validColors? 'Colors are valid' : 'Not a valid file'))
        if (validColors) {
            dispatch({type: 'SET_CHANNELS', payload: contentArray});
        } else {
            alert('The file your imported is not valid. Please try another file.');
        }
    }

    function interpretJsonLoad(content) {
        const channelsArray = JSON.parse(content);

        var newChannels = [];
        for (var i=0; i<channelsArray.length; i++) {
            let channelCopy = channelsArray[i];
            

            let newChannel = {
                name: (('name' in channelCopy)? channelCopy.name : ''),
                colors: (('colors' in channelCopy)? channelCopy.colors.map(color=> (hexRegExp.test(color))? color : '#ffffff' ) : []),
                img_url: (('img_url' in channelCopy)? channelCopy.img_url : ''),
                img_active: (('img_active' in channelCopy)? channelCopy.img_active : '')
            }

            newChannels.push(newChannel);
        }
        console.log(newChannels);
        dispatch({type: 'SET_CHANNELS', payload: newChannels});
        
    }

    function saveFile() {
        let blob = new Blob([JSON.stringify(channels)], {type: "application/json"});
        saveAs(blob,"palette.json");
    }

    function handleFileLoad(event) {
        console.log('LOADING!');
        
        const file = event.target.files[0];
        fileReader = new FileReader();
        fileReader.onloadend = readFileJson;
        fileReader.readAsText(file);
    }

    function readFileJson(e) {
        const content = fileReader.result;
        console.log(content);
        interpretJsonLoad(content);
    }

    return (
        <MenuBar>
            <button className="menu-item" onClick={saveFile}>Save</button>
            <input type="file" name="load-file" id="load-file" accept="application/JSON" ref={loadRef} onChange={event=>handleFileLoad(event)}/>
            <label className="menu-item" htmlFor="load-file">Load</label>

            <input type="file" name="file" id="file" accept="text/plain" ref={importRef} onChange={event=>handleFileImport(event)}/>
            <label className="menu-item" htmlFor="file">Import</label>
            
            <button className="menu-item" onClick={exportFile}>Export</button>
            <button className="menu-item" onClick={resetChannels}>Reset Channels</button> 
        </MenuBar>
    )
}