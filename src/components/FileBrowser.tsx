import React, { useState } from 'react';
import './css/Buttons.css';
import './css/FileBrowser.css';
import View from './View';
import { Segment } from './models/Segment';
import { File } from './models/File';
import axios from "axios";
import { Endpoints, OctokitResponse } from "@octokit/types";
import { Octokit } from "@octokit/rest";
import { Buffer } from "buffer";
import { Tokens } from "./models/Tokens";
import { OctokitInfo } from "./models/OctokitInfo";

interface FileBrowserProps {
    setFile: (segments: Array<Segment>) => void;
    goToRecord: () => void;
    tokens: Tokens;
    octokitInfo: OctokitInfo;
}

export default function FileBrowser({ setFile, goToRecord, tokens, octokitInfo }: FileBrowserProps) {

    const [fileNames, setFileNames] = useState<Array<string> | null>(null);

    if (fileNames == null) {
        getListOfFilesFromRepo().then(newFileNames => {
            setFileNames(newFileNames);
        });
    }

    let listOfNameFiles = fileNames?.map((fileName, index) => {
        return (
            <li key={index} className='rowOfFiles'>
                <div className='fileName'>{fileName}</div>
                <div className='openFile'>
                    <button className='openFileButton' key={index} onClick={() => { OpenFile(fileName) }} >
                        Otwórz
                    </button>
                </div>
            </li>
        );
    });

    return (
        <>
            <ul id='listOfFiles'>
                {listOfNameFiles}
            </ul>
            <div className='newFileDiv'>
                <button className='newFileButton' onClick={() => { goToRecord() }}>Nowy plik</button>
            </div>
        </>
    );

    async function getListOfFilesFromRepo(): Promise<Array<string>> {

        const response = await octokitInfo.octokitReadFree.repos.getContent({
            owner: octokitInfo.owner,
            repo: octokitInfo.publicRepoName,
            path: "data",
        });

        if (!Array.isArray(response.data)) {
            console.error("The provided path does not point to a directory.");
            return new Array<string>();
        }

        const directories = response.data.filter((item) => item.type === "dir").map((item) => item.name);

        return directories;
    }

    async function OpenFile(fileName: string){

        try {
            const response = await octokitInfo.octokitReadFree.repos.getContent({
                owner: octokitInfo.owner,
                repo: octokitInfo.publicRepoName,
                path: `data/${fileName}/segments.json`,
            });

            console.log(response.data);

            //let Buffer = require("buffer").Buffer
            let fileContent = (Buffer as any).from((response.data as any).content, "base64");
            let JSONData: Array<Segment> = JSON.parse(fileContent);

            console.log(JSONData);
            setFile(JSONData);
        }catch(error: any)
        {
            console.log("Błąd", error);
        }
        
    }
}