import React, { useState, FunctionComponent } from 'react';
import './css/Buttons.css';
import { Segment } from './models/Segment';
import axios from 'axios';
import { Octokit } from "@octokit/rest";
import { Buffer } from "buffer"
import { Tokens } from "./models/Tokens";
import { OctokitInfo } from "./models/OctokitInfo";

interface ButtonsProps {
    meaningData: Array<Segment>;
    setNewMeaningData: (segments: Array<Segment>) => void;
    tokens: Tokens;
    octokitInfo: OctokitInfo;
}

//aktualizowac

export default function Buttons({ meaningData, setNewMeaningData, tokens, octokitInfo }: ButtonsProps) {

    const buttons = meaningData.map((segment: Segment, index: number) => {

        const ref = React.createRef<HTMLInputElement>();

        return (
            <div className="buttonSegments" key={index.toString() + "d"}>
                <input type="text" id={index.toString()} ref={ref} key={index.toString() + "e"} className="inputSegment" defaultValue={segment.word}></input>
                <input id={index.toString() + "i"} key={index.toString() + "p"} className="inputButtons" defaultValue={segment.meaning != null ? segment.meaning : ""}></input>
                <audio controls>
                    <source src="https://raw.githubusercontent.com/miandrop/data-public/main/voice-files/test/plik.wav" type="audio/wav" />
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

            <div className="supportFiles">
                <button onClick={Prepare}>Dalej</button>
                Nazwa pliku: <input type='text' id='fileName'></input>
                <button onClick={() => { saveMeaningData(); }}>Zapisz</button>
            </div>
        </>
    );

    function Prepare() {
        let copyMeaning = meaningData.slice();

        for (let i: number = 0; i < copyMeaning.length; ++i) {
            copyMeaning[i].meaning = Translate(copyMeaning[i].word);
        }

        SendRequestForSpeech(copyMeaning[0].word);

        setNewMeaningData(copyMeaning);
    }

    // function saveMeaningData() {
    //     let fileName = (document.getElementById("fileName") as HTMLInputElement).value;
    //     let data = GetUpdateMeaningData();
    //     let jsonData = JSON.stringify(data);

    //     const filePath = 'files/translations/' + fileName + '.json';

    //     const repository = github.getRepo(owner, repoName);

    //     repository.writeFile(branch, filePath, jsonData, 'Zapis pliku JSON', {})
    //         .then(() => {
    //             console.log('Plik JSON został zapisany pomyślnie.');
    //         })
    //         .catch((error: Error) => {
    //             console.error('Wystąpił błąd podczas zapisu pliku JSON:', error);
    //         });
    // }

    // async function saveFileToGitHub(filePath: string, content: fs.ReadStream) {
    //     try {
    //       const octokit = new Octokit({ auth: token });

    //       // Odczytaj zawartość pliku ze strumienia
    //       const chunks: Uint8Array[] = [];
    //       for await (const chunk of content) {
    //         chunks.push(chunk);
    //       }

    //       // Połącz dane binarne w jedną zmienną typu 'Buffer'
    //       const fileBuffer = Buffer.concat(chunks);

    //       // Wyślij zawartość do repozytorium na GitHub
    //       const owner = "miandrop";
    //       const repo = "data-public";
    //       const branch = 'main';
    //       const filePath = "voice-files/test/pliczek.mp3";

    //       await octokit.repos.createOrUpdateFileContents({
    //         owner,
    //         repo,
    //         path: filePath,
    //         message: 'Dodano plik do repozytorium',
    //         content: fileBuffer.toString('base64'),
    //         // committer: {
    //         //   name: 'TwójNazwaUżytkownika',
    //         //   email: 'twój@adres-email.com',
    //         // },
    //       });

    //       console.log('Plik został zapisany w repozytorium GitHub.');
    //     } catch (error) {
    //       console.error('Wystąpił błąd podczas zapisywania pliku:', error);
    //     }
    //   }

    function GetUpdateMeaningData(): Array<Segment> {
        //words, 
        let newMeaningData = meaningData.slice();

        for (let i = 0; i < newMeaningData.length; ++i) {
            let meaning = (document.getElementById(i.toString() + "i") as HTMLInputElement).value;
            newMeaningData[i].meaning = meaning;
        }

        return newMeaningData;
    }

    // function ClickTheSegment(button: HTMLButtonElement | null, index: number) {
    //     if (button == null) {
    //         return;
    //     }

    //     if (clicked[index]) {
    //         clicked[index] = false;
    //     }
    //     else {
    //         clicked[index] = true;
    //     }

    //     button.classList.toggle('active');
    // }

    // function ClickTheDoneSegment(button: HTMLButtonElement | null, index: number) {
    //     if (button == null) {
    //         return;
    //     }

    //     if (clicked[index]) {
    //         clicked[index] = false;
    //     }
    //     else {
    //         clicked[index] = true;
    //     }

    //     button.classList.toggle('active');
    // }

    // function MergeButtonClicked() {
    //     let newMeaningData = new Array<Segment>();

    //     let firstIndex = undefined;
    //     let words = "";

    //     for (let i = 0; i < meaningData.length; ++i) {
    //         if (clicked[i]) {
    //             if (firstIndex === undefined) {
    //                 firstIndex = i;

    //                 for (var k = i; k < meaningData.length; ++k) {
    //                     if (!clicked[k]) {
    //                         break;
    //                     }
    //                     words += " " + meaningData[k].word;
    //                 }
    //                 words = words.slice(1);//tlu
    //                 newMeaningData.push(new Segment(words, null));
    //                 i = k - 1;
    //             }
    //             else {
    //                 newMeaningData.push(meaningData[i]);
    //             }
    //         }
    //         else {
    //             newMeaningData.push(meaningData[i]);
    //         }
    //     }

    //     setNewMeaningData(newMeaningData);
    // }

    // function SplitButtonClicked() {
    //     for (let i = 0; i < clicked.length; ++i) {
    //         if (clicked[i]) {

    //             Split(i);
    //         }
    //     }
    // }

    function Split(index: number) {
        const segmentButton = (document.getElementById(index.toString()) as HTMLButtonElement);
        const text = segmentButton.innerHTML.trim();

        if (text !== '') {
            const words = text.split(' ');

            let segments = meaningData.slice(0, index);

            segments = segments.concat(words.map((word) => {
                return new Segment(word);
            }));

            segments = segments.concat(meaningData.slice(index + 1));

            console.log(segments);

            setNewMeaningData(segments);
        }
    }

    // function Translate(textToTranslate: string): Promise<string> {

    //     const sourceLanguage = 'EN';
    //     const targetLanguage = 'PL';

    //     const apiUrl = `https://api-free.deepl.com/v2/translate?auth_key=${deeplToken}&text=${textToTranslate}&source_lang=${sourceLanguage}&target_lang=${targetLanguage}`;

    //     // axios.post(apiUrl)
    //     //     .then(response => {
    //     //         result = response.data.translations[0].text;
    //     //         return result;
    //     //     })
    //     //     .catch(error => {
    //     //         console.error('Błąd podczas przetwarzania żądania:', error);
    //     //     });

    //     return axios
    //     .post(apiUrl)
    //     .then(response => {
    //       const translation: string = response.data.translations[0].text;
    //       return translation;
    //     })
    //     .catch(error => {
    //       console.error('Błąd podczas przetwarzania żądania:', error.message);
    //       throw error;
    //     });
    // }

    function Translate(textsToTranslate: string): string {
        const sourceLanguage = 'EN';
        const targetLanguage = 'PL';

        var request = require('sync-request');

        const apiUrl = `https://api-free.deepl.com/v2/translate?auth_key=${deeplToken}&source_lang=${sourceLanguage}&target_lang=${targetLanguage}&text=${textsToTranslate}`;

        const response = request('POST', apiUrl);

        const responseData = JSON.parse(response.getBody('utf-8'));

        return responseData.translations[0].text;
    }

    async function SendRequestForSpeech(text: string) {
        console.log("wysylanie start");

        const options = {
            method: 'GET',
            url: 'https://text-to-speech27.p.rapidapi.com/speech',
            params: {
                text: text,
                lang: 'en-uk'
            },
            headers: {
                'X-RapidAPI-Key': 'bc4a8ba676mshc7c55e59c40f659p188cfbjsn34831c4bee75',
                'X-RapidAPI-Host': 'text-to-speech27.p.rapidapi.com'
            },
        };

        try {
            const response = await axios.request(options);
            //console.log(response);

            const fileBuffer = Buffer.from(response.data);

            console.log(fileBuffer);

            const blob = new Blob([response.data], { type: 'audio/mpeg' });

            console.log(blob);;

            // Zapisujemy dane do pliku na dysku
            // fs.writeFile("C:\Users\Patryk Pasierbik\Desktop\zapisane\muzyka.mp3", fileBuffer, (err) => {
            //     if (err) {
            //         console.error('Wystąpił błąd podczas zapisywania pliku:', err);
            //     } else {
            //         console.log('Plik został zapisany na dysku.');
            //     }
            // });

            // const imageUrl = URL.createObjectURL(response.data);

            // console.log(imageUrl);

            // const fs = require("fs");

            // const writer = fs.createWriteStream("pliczek.mp3");
            // response.data.pipe(writer);

            saveFileToGitHub("", blob, response.headers['content-type']);

            //saveFileToGitHub("", writer);

            //console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function saveFileToGitHub(filePath: string, fileBlob: Blob, contentType: string) {
        const owner = "miandrop";
        const repo = "data-public";
        const branch = 'main';
        const path = "voice-files/test/pliczek.mp3";

        try {
            const octokit = new Octokit({ auth: token });

            console.log(token);

            const reader = new FileReader();
            reader.readAsArrayBuffer(fileBlob);
            reader.onloadend = async function () {
                const buffer = Buffer.from(reader.result as any);

                try {
                    // Wyślij zawartość do repozytorium na GitHub
                    await octokit.repos.createOrUpdateFileContents({
                        owner,
                        repo,
                        path: path,
                        message: 'Dodano plik do repozytorium',
                        content: buffer.toString('base64'),
                        headers: {
                            'Content-Type': 'audio/mpeg',
                        },
                    });

                    console.log('Plik został zapisany w repozytorium GitHub.');
                } catch (error) {
                    console.error('Wystąpił błąd podczas zapisywania pliku:', error);
                }
            };

            // Konwersja strumienia do danych binarnych (bufora)
            //const fileBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content);


            //console.log(contentType);

            // Wyślij zawartość do repozytorium na GitHub
            // await octokit.repos.createOrUpdateFileContents({
            //     owner,
            //     repo,
            //     path: path,
            //     message: 'Dodano plik do repozytorium',
            //     content: fileBuffer.toString('base64'),
            //     // committer: {
            //     //     name: 'TwójNazwaUżytkownika',
            //     //     email: 'twój@adres-email.com',
            //     // },
            //     // Ustawienie nagłówka 'Content-Type' w oparciu o wartość przekazaną w argumencie
            //     headers: {
            //         'Content-Type': contentType,
            //     },
            // });

        } catch (error) {
            console.error('Wystąpił błąd podczas zapisywania pliku:', error);
        }
    }
}



function setValueForButton(button: HTMLButtonElement | null, value: string | null) {
    if (button == null || value == null) {
        return;
    }
    button.innerHTML = value;
    button.classList.toggle('onmouse');
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
    return sum + 15;
}