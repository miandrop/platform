import './css/View.css';
import React from 'react';
import { Segment } from './models/Segment';

interface ViewProps {
    meaningData: Array<Segment>;
    goReturn: () => void;
}

export default function View({ meaningData, goReturn }: ViewProps) {

    const wordsButtons = meaningData.map((segment, index) => {
        const ref = React.createRef<HTMLButtonElement>();
        return (
            <td className='segment'>
                <button ref={ref} key={index + segment.word} id={index + "n"} style={{ width: getWidthFromtext(segment.word) }} className="view-button" onClick={() => ClickTheSegment(ref.current, index.toString())}>
                    {segment.word}
                </button>
            </td>
        );
    });

    const meaningButtons = meaningData.map((segment, index) => {
        return (
            <td className='segment'>
                <button key={index} id={index.toString()} className="meaning-button" style={{ width: getWidthFromtext(segment.word) }}>
                    {segment.meaning}
                </button>
            </td>
        );
    });

    return (
        <div className="view">
            {/* <div>
                {meaningButtons}
            </div>
            <div>
                {wordsButtons}
            </div> */}
            <table id='containerForViews'>
                <tr>
                    {meaningButtons}
                </tr>
                <tr>
                    {wordsButtons}
                </tr>
            </table>

            <button onClick={goReturn}>Powrót</button>
        </div>
    );
}

function ClickTheSegment(button: HTMLButtonElement | null, index: string) {
    let meaningButton = document.getElementById(index);

    if (meaningButton == null || button == null) {
        return;
    }
    button.classList.toggle('active');

    if (meaningButton.style.color === "white") {
        meaningButton.style.color = "rgb(87, 91, 95)";
    }
    else {
        meaningButton.style.color = "white";
    }
}

function getWidthFromtext(text: string) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    if (context == null) {
        return;
    }
    context.font = "16px Arial";
    let sum = 0;

    for (let i = 0; i < text.length; ++i) {
        sum += context.measureText(text[i]).width;
    }
    console.log(sum);
    return sum;
}