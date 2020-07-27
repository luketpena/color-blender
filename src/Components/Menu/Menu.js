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

//This reg-ex validates a string as a hex
const hexRegExp = /^#[0-9A-F]{6}$/i; 

export default function Menu() {

    const dispatch = useDispatch();
    const channels = useSelector(state=>state.channelsReducer);
    const importRef = useRef(null);
    const loadRef = useRef(null);
    let fileReader; //Used by file imports

    //This exports the file for use in GMS
    function exportFile() {
        let text = '';
        for (let channel of channels) {
            text += `${channel.name} = [${channel.colors.toString()}];\n`;
        }
        let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob,"palette.txt");
    }

    //This resets the whole editor to an empty default state
    function resetChannels() {
        let q = window.confirm('Are you sure you want to reset all channels?');
        if (q) {
            dispatch({type: 'RESET_CHANNELS'})
        }
    }

    /*-----< GMS Templated Importing and Exporting >-----*/
    //Imports a GMS templated palette
    function handleFileImport(event) {
        const file = event.target.files[0];
        fileReader = new FileReader();
        fileReader.onloadend = readFile;
        fileReader.readAsText(file);
    }

    //Reads the content of the file
    function readFile(e) {
        const content = fileReader.result;
        console.log(content);
        interpretPalleteImport(content);
    }

    //Interprets a GMS palette into channels
    function interpretPalleteImport(content) {

        //Remove line breaks and split up by rows
        let contentArray = content.replace( /\r\n|\n|\r/gm, '' ).split(';');
        contentArray.pop(); //Creates a dummy final row, this cleans it up

        //Innocent until proven guilty
        let validColors = true;

        //Iterate through the array to determine if they are legitimate palettes
        for (let i=0; i<contentArray.length; i++) {

            //Each row has the content 'someArray = ['fff','fff']
            contentArray[i] = contentArray[i].split(' = ');
            //If this format does is not true, then it is not a valid import
            if (contentArray[i].length!==2) {
              validColors = false;
              break;
            }
            //Reformat the content array as a template for creating channels
            contentArray[i] = {
                name: contentArray[i][0],
                colors: contentArray[i][1].replace( /\[|\]/g, '').split(',')
            }  
        }

        //Now to validate the colors
        for (let i=0; i<contentArray.length; i++) {
            //Make sure the thing is an actual iterable array
            if (Array.isArray(contentArray[i].colors)) {
                for (let color of contentArray[i].colors) {
                    //Make sure each color is a legitimate hex-color value
                    if (!hexRegExp.test(color)) validColors = false;
                }
            } else {
                validColors = false;
            }
        }

        //If nothing was imported, then it is not a valid import
        if (contentArray.length===0) validColors = false;

        console.log(contentArray);
        console.log((validColors? 'Colors are valid' : 'Not a valid file'));

        if (validColors) {
            //Set the channels if valid import
            dispatch({type: 'SET_CHANNELS', payload: contentArray});
        } else {
            //Alert the user if not valid import
            alert('The file your imported is not valid. Please try another file.');
        }
    }

    /*-----< JSON Templated Saving and Loading >-----*/
    //Saves the channels as a JSON file for reloading
    function saveFile() {
      let blob = new Blob([JSON.stringify(channels)], {type: "application/json"});
      saveAs(blob,"palette.json");
    }

    //Loads a Color Picker templated palette
    function handleFileLoad(event) {
      const file = event.target.files[0];
      fileReader = new FileReader();
      fileReader.onloadend = readFileJson;
      fileReader.readAsText(file);
    }

    //Reads the JSON palette
    function readFileJson(e) {
        const content = fileReader.result;
        interpretJsonLoad(content);
    }

    //Color Picker templated palettes use JSON to package files must be interpreted as JSON
    function interpretJsonLoad(content) {
        //Prep for work
        const channelsArray = JSON.parse(content);

        //Iterate through the JSON and find what data can be pulled from it
        var newChannels = [];
        for (var i=0; i<channelsArray.length; i++) {
            let channelCopy = channelsArray[i];

            //If an attribute is not found, it is replaced with a blank or default value
            let newChannel = {
                name: (('name' in channelCopy)? channelCopy.name : `channel_${i}`),
                colors: (('colors' in channelCopy)? channelCopy.colors.map(color=> (hexRegExp.test(color))? color : '#ffffff' ) : []),
                img_url: (('img_url' in channelCopy)? channelCopy.img_url : ''),
                img_active: (('img_active' in channelCopy)? channelCopy.img_active : '')
            }
            //Add it to the new list of channels
            newChannels.push(newChannel);
        }
        //Create the channels
        console.log(newChannels);
        dispatch({type: 'SET_CHANNELS', payload: newChannels});
        
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