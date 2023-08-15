import './css/View.css';
import React from 'react';
import { Segment } from './models/Segment';

interface ViewProps {
    segmentsData: Array<Segment>;
    goReturn: () => void;
}

export default function View({ segmentsData, goReturn }: ViewProps) {

    const buttons = segmentsData.map((segment: Segment, index: number) => {

        const ref = React.createRef<HTMLInputElement>();

        return (
            // <div className="buttonSegment" key={index.toString() + "d"}>
            //     <input type="text" id={index.toString() + "e"} ref={ref} key={Math.random()} className="inputSentence" value={segment.word}></input>
            //     <input id={index.toString() + "p"} key={Math.random()} className="inputMening" value={segment.meaning != null ? segment.meaning : ""}></input>
            //     <audio controls key={segment.pathToVoice}>
            //         <source id={index.toString() + "src"} src={segment.pathToVoice ? segment.pathToVoice : ""} type="audio/mpeg" />
            //         Twoja przeglądarka nie obsługuje elementu audio.
            //     </audio>
            // </div>
            <div className="buttonSegment" key={index.toString() + "d"}>
                <span key={Math.random()} className="inputSentence" >{segment.word}</span>
                <span key={Math.random()} className="inputSentence" >{segment.meaning}</span>
                <audio controls key={segment.pathToVoice}>
                    <source id={index.toString() + "src"} src={segment.pathToVoice ? segment.pathToVoice : ""} type="audio/mpeg" />
                    Twoja przeglądarka nie obsługuje elementu audio.
                </audio>
            </div>
        );
    });

    return (
        <>
            <div className="buttons">
                {buttons}
            </div>
            <button onClick={goReturn}>Powrót</button>
        </>
    );
}

// function ClickTheSegment(button: HTMLButtonElement | null, index: string) {
//     let meaningButton = document.getElementById(index);

//     if (meaningButton == null || button == null) {
//         return;
//     }
//     button.classList.toggle('active');

//     if (meaningButton.style.color === "white") {
//         meaningButton.style.color = "rgb(87, 91, 95)";
//     }
//     else {
//         meaningButton.style.color = "white";
//     }
// }

// function getWidthFromtext(text: string) {
//     var canvas = document.createElement("canvas");
//     var context = canvas.getContext("2d");
//     if (context == null) {
//         return;
//     }
//     context.font = "16px Arial";
//     let sum = 0;

//     for (let i = 0; i < text.length; ++i) {
//         sum += context.measureText(text[i]).width;
//     }
//     console.log(sum);
//     return sum;
// }