import Buttons from './Buttons';
import './css/Record.css';
import { useState } from 'react';
import { Segment } from './models/Segment';
import axios from 'axios';
import {Tokens} from "./models/Tokens";
import { OctokitInfo } from './models/OctokitInfo';

interface RecordProps {
    goReturn: () => void;
    tokens: Tokens;
    octokitInfo: OctokitInfo;
}

export default function Record({ goReturn, tokens, octokitInfo}: RecordProps) {
    const [meaningData, setMeaningData] = useState<Array<Segment> | null>(null);

    return (
        <>
            <textarea id="record-textarea"></textarea>
            <div className='recordButtons'>
                <button onClick={() => { SaveTextArea(); }}>Dalej</button>
                <button onClick={() => { goReturn(); }}>Powrót</button>
            </div>
            {meaningData ? <Buttons meaningData={meaningData} setNewMeaningData={setNewMeaningData} tokens={tokens} octokitInfo={octokitInfo} /> : null}
        </>
    );

    function setNewMeaningData(newValue: Array<Segment>) {
        setMeaningData(newValue);
    }

    function SaveTextArea() {
        const textarea = (document.getElementById("record-textarea") as HTMLTextAreaElement);

        const text = textarea.value.split('\n');

        let result = new Array<Segment>(text.length);

        for (let i: number = 0; i < text.length; ++i) {
            result[i] = new Segment(text[i]);
        }
        setMeaningData(result);
    }
}