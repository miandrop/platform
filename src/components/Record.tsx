import Buttons from './components/Buttons';
import './css/Record.css';
import React, { useState } from 'react';
import { Segment } from './models/Segment';
import axios from 'axios';
import { Tokens } from "./models/Tokens";
import { OctokitInfo } from './models/OctokitInfo';

interface RecordProps {
    goReturn: () => void;
    tokens: Tokens;
    octokitInfo: OctokitInfo;
}

export default function Record({ goReturn, tokens, octokitInfo }: RecordProps) {
    const [textAreaValue, setTextAreaValue] = useState<string | null>(null);

    return (
        <>
            <textarea id="record-textarea"></textarea>
            <div className='recordButtons'>
                <button onClick={() => { SaveTextArea(); }}>Dalej</button>
                <button onClick={() => { goReturn(); }}>Powrót</button>
            </div>
            {textAreaValue ? <Buttons textAreaValue={textAreaValue} tokens={tokens} octokitInfo={octokitInfo} /> : null}
        </>
    );

    function SaveTextArea() {
        const textarea = (document.getElementById("record-textarea") as HTMLTextAreaElement);
        setTextAreaValue(textarea.value);
    }
}