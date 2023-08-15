import React, { useState, useEffect } from 'react';
import './css/Buttons.css';
import { Segment } from '../models/Segment';
import axios from 'axios';
import { Octokit } from "@octokit/rest";
import { Buffer } from "buffer";
import { Tokens } from "../models/Tokens";
import { OctokitInfo } from "../models/OctokitInfo";
import { Stream } from 'stream';
import { File } from '../models/File';
//import  audiobufferToBlob from 'audiobuffer-to-blob';

interface ButtonsProps {
    textAreaValue: string;
    tokens: Tokens;
    octokitInfo: OctokitInfo;
}

export default function Buttons({ textAreaValue, tokens, octokitInfo }: ButtonsProps) {
    const [segmentsData, setSegmentsData] = useState<Array<Segment>>(new Array<Segment>(0));
    const [audioData, setAudioData] = useState<Array<Blob> | null>(null);

    useEffect(() => {
        GenerateSegmentsDataFromString(textAreaValue).then(newSegmentData => setSegmentsData(newSegmentData));
    }, [textAreaValue]);

    const buttons = segmentsData.map((segment: Segment, index: number) => {

        const ref = React.createRef<HTMLInputElement>();

        return (
            <div className="buttonSegments" key={index.toString() + "d"}>
                <input type="text" id={index.toString() + "e"} ref={ref} key={Math.random()} className="inputSegment" defaultValue={segment.word}></input>
                <input id={index.toString() + "p"} key={Math.random()} className="inputButtons" defaultValue={segment.meaning != null ? segment.meaning : ""}></input>
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

            <div className="supportFiles">
                <button onClick={GenerateAudio}>Dalej</button>
                Nazwa pliku: <input type='text' id='fileName'></input>
                <button onClick={() => { saveFile(); }}>Zapisz</button>
            </div>
        </>
    );

    async function GenerateSegmentsDataFromString(stringData: string): Promise<Array<Segment>> {
        const sentences = stringData.split('\n');

        const translations = await TranslateSentences(sentences);

        let result = new Array<Segment>(sentences.length);

        for (let i: number = 0; i < sentences.length; ++i) {
            result[i] = new Segment(sentences[i], translations[i]);
        }

        return result;
    }

    async function GenerateAudio() {
        //zmieniać tylko zapisane

        let newSegmentsData = new Array<Segment>();

        for (let i: number = 0; i < segmentsData.length; ++i) {
            let sentence = (document.getElementById(i.toString() + "e") as HTMLInputElement).value;
            let meaning = (document.getElementById(i.toString() + "p") as HTMLInputElement).value;

            newSegmentsData.push(new Segment(sentence, meaning));
        }

        let blobs = new Array<Blob>();

        let mainCounter = 0;

        for (let i: number = 0; mainCounter < newSegmentsData.length; ++i) {
            let sendRequests = new Array<Promise<Blob>>();

            for (let j: number = 0; j < 30; ++j) {
                sendRequests.push(SendRequestForSpeech(newSegmentsData[j].word));
                ++mainCounter;

                if (mainCounter == newSegmentsData.length) {
                    break;
                }
            }

            let blobsResult = await Promise.all(sendRequests);

            blobs = blobs.concat(blobsResult);

            if (mainCounter < newSegmentsData.length) {
                await oneSecond();
            }
        }

        function oneSecond(): Promise<void> {
            return new Promise<void>((resolve) => setTimeout(resolve, 1050));
        }

        for (let i: number = 0; i < newSegmentsData.length; ++i) {
            newSegmentsData[i].pathToVoice = URL.createObjectURL(blobs[i]);
        }

        setSegmentsData(newSegmentsData);
        setAudioData(blobs);
    }

    async function SendRequestForSpeech(text: string): Promise<Blob> {
        const options = {
            method: 'GET',
            url: 'https://text-to-speech-api3.p.rapidapi.com/speak',
            params: {
                text: text,
                lang: 'en',
            },
            headers: {
                'X-RapidAPI-Key': tokens.speech,
                'X-RapidAPI-Host': 'text-to-speech-api3.p.rapidapi.com'
            },
            responseType: 'arraybuffer'
        } as any;

        try {
            const audiobufferToBlob = require('audiobuffer-to-blob');

            const response = await axios.request(options);
            const ctx = new AudioContext();
            const decode = await ctx.decodeAudioData(response.data);
            const blob = audiobufferToBlob(decode);

            return new Promise<Blob>((resolve, reject) => { resolve(blob) });
        } catch (error) {
            console.error(error);
            return new Promise<Blob>((resolve, reject) => { reject(error) });
        }
    }

    async function saveFile() {

        console.log("zapisujemy");
        // katalog{nazwa pliku}, json z segmentami, katalog voices z audio

        let fileName = (document.getElementById("fileName") as HTMLInputElement).value;

        if (audioData == null) {
            return;
        }

        if (fileName.length == 0) {
            alert("brak nazwy pliku");
            return;
        }

        let addToGithubPromises = new Array<Promise<any>>();

        const basePath = `data/${fileName}/`;
        const basePathForAudio = `${basePath}audio/`;

        let newSegmentsData = segmentsData.slice();

        try {
            for (let i: number = 0; i < segmentsData.length; ++i) {
                await saveFileToGithub(basePathForAudio + `${i}.mp3`, audioData[i]);
                newSegmentsData[i].pathToVoice = `https://raw.githubusercontent.com/miandrop/data-public/main/${basePathForAudio}${i}.mp3`;
            }

            await saveFileToGithub(basePath + "segments.json", newSegmentsData);

            console.log("zapisano wszystko");

        } catch (error: any) {
            console.error("Wystąpił błąd:", error);
        }


        // let fileName = (document.getElementById("fileName") as HTMLInputElement).value;
        // let data = GetUpdateMeaningData();
        // let jsonData = JSON.stringify(data);

        // const filePath = 'files/translations/' + fileName + '.json';

        // const repository = github.getRepo(owner, repoName);

        // repository.writeFile(branch, filePath, jsonData, 'Zapis pliku JSON', {})
        //     .then(() => {
        //         console.log('Plik JSON został zapisany pomyślnie.');
        //     })
        //     .catch((error: Error) => {
        //         console.error('Wystąpił błąd podczas zapisu pliku JSON:', error);
        //     });
    }

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

    // function GetUpdateMeaningData(): Array<Segment> {
    //     //words, 
    //     let newMeaningData = meaningData.slice();

    //     for (let i = 0; i < newMeaningData.length; ++i) {
    //         let meaning = (document.getElementById(i.toString() + "i") as HTMLInputElement).value;
    //         newMeaningData[i].meaning = meaning;
    //     }

    //     return newMeaningData;
    // }

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

    // function Split(index: number) {
    //     const segmentButton = (document.getElementById(index.toString()) as HTMLButtonElement);
    //     const text = segmentButton.innerHTML.trim();

    //     if (text !== '') {
    //         const words = text.split(' ');

    //         let segments = meaningData.slice(0, index);

    //         segments = segments.concat(words.map((word) => {
    //             return new Segment(word);
    //         }));

    //         segments = segments.concat(meaningData.slice(index + 1));

    //         console.log(segments);

    //         setNewMeaningData(segments);
    //     }
    // }

    async function TranslateSentences(sentences: Array<string>): Promise<Array<string>> {
        const sourceLanguage = 'en';
        const targetLanguage = 'pl';

        const request = require('sync-request');
        const baseApiUrl = `https://api-free.deepl.com/v2/translate?auth_key=${tokens.deepl}&source_lang=${sourceLanguage}&target_lang=${targetLanguage}`;

        let mainCounter = 0;
        let resultArray: Array<string> = new Array<string>();

        try {

            for (let i: number = 0; mainCounter < sentences.length; ++i) {
                let apiUrl = baseApiUrl;

                for (let j: number = 0; j < 50; ++j) {
                    apiUrl += "&text=" + sentences[mainCounter];
                    ++mainCounter;

                    if (mainCounter == sentences.length) {
                        break;
                    }
                }

                const response = request('POST', apiUrl);
                console.log(response);

                const responseBody = JSON.parse(response.getBody('utf8'));

                const responseTranslations = responseBody.translations.map((translation: any) => translation.text) as Array<string>;

                resultArray = resultArray.concat(responseTranslations);
            }

            return resultArray;
        } catch (error: any) {
            return ['Error: ' + error.message];
        }
    }

    async function Translate(sentence: string): Promise<string> {
        const sourceLanguage = 'EN';
        const targetLanguage = 'PL';

        const request = require('sync-request');

        const apiUrl = `https://api-free.deepl.com/v2/translate?auth_key=${tokens.deepl}&source_lang=${sourceLanguage}&target_lang=${targetLanguage}&text=${sentence}`;
        const response = request('POST', apiUrl);

        const responseBody = JSON.parse(response.getBody('utf8'));
        return responseBody.translations[0].text;
    }

    async function blobToBase64Async(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onerror = (e) => reject(fileReader.error);
            fileReader.onloadend = (e) => {
                const dataUrl = fileReader.result as string;
                // remove "data:mime/type;base64," prefix from data url
                const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
                resolve(base64);
            };
            fileReader.readAsDataURL(blob);
        });
    }


    // async function saveFileToGitHub(filePath: string, raw: string, contentType: string) {
    //     const owner = "miandrop";
    //     const repo = "data-public";
    //     const branch = 'main';
    //     const path = "voice-files/test/pliczek4.mp3";

    //     try {

    //         await octokitInfo.octokitPublic.repos.createOrUpdateFileContents({
    //             owner,
    //             repo,
    //             path: path,
    //             message: 'Dodano plik do repozytorium',
    //             content: raw,
    //             headers: {
    //                 'Content-Type': 'audio/mpeg',
    //             },
    //         });
    //         console.log("dobrze wszystko dziala");
    //     }
    //     catch (error) {
    //         console.error('Wystąpił błąd podczas zapisywania pliku:', error);
    //     }
    // }

    async function saveFileToGithub(filePath: string, fileContent: any): Promise<any> {
        let stringContent: string;

        if (fileContent instanceof Blob) {
            stringContent = await blobToBase64Async(fileContent);
        }
        else {
            stringContent = Buffer.from(JSON.stringify(fileContent)).toString('base64');
        }

        try {
            await octokitInfo.octokitPublic.repos.createOrUpdateFileContents({
                owner: octokitInfo.owner,
                repo: octokitInfo.publicRepoName,
                path: filePath,
                message: `${Math.random()} ${filePath}`,
                content: stringContent,
                // headers: {
                //     'Content-Type': 'audio/mp3',
                // },
            });
        }
        catch (error) {
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
