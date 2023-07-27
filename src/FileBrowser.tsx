// import React, { useState } from 'react';
// import './css/Buttons.css';
// import './css/FileBrowser.css';
// import View from './View';
// import { Segment } from './models/Segment';
// import { File } from './models/File';
// import axios from "axios";
// import { Endpoints, OctokitResponse } from "@octokit/types";
// import { Octokit } from "@octokit/rest";
// import { Buffer } from "buffer";
// import {Tokens} from "./models/Tokens";

// interface FileBrowserProps {
//     setFile: (segments: Array<Segment>) => void;
//     goToRecord: () => void;
//     tokens: Tokens
// }

// export default function FileBrowser({ setFile, goToRecord, tokens }: FileBrowserProps) {

//     const [files, setFiles] = useState<Array<File>>(new Array<File>());

//     const GitHub = require("github-api");

//     const github = new GitHub({
//         token: token,
//     });

//     const owner = "miandrop";
//     const repo = "data";
//     const path = "files/translations";

//     const url = "repos/miandrop/data/contents/files/translations";

//     console.log(files);

//     if (files.length == 0) {
//         const octokit = new Octokit({
//             auth: token,
//             baseUrl: "https://api.github.com",
//         });

//         const response = octokit.repos.getContent({
//             owner,
//             repo,
//             path,
//         }).then((response: any) => {

//             console.log(response.data);

//             if (Array.isArray(response.data)) {
//                 console.log(response.data);
//                 setFiles(response.data);
//             }
//         });

//         // const repository = github.getRepo(owner, repoName);

//         // repository.getContents("main", path, true)
//         //     .then((response: any) => {
//         //         if (Array.isArray(response.data)) {
//         //             console.log(response.data);
//         //             setFiles(response.data);
//         //         }
//         //     })
//         //     .catch((error: Error) => {
//         //         console.error("Wystąpił błąd podczas pobierania plików:", error);
//         //     });
//     }

//     let listOfFiles = files.map((file, index) => {
//         return (
//             <li key={index} className='rowOfFiles'>
//                 <div className='fileName'>{file.name.slice(0, -5)}</div>
//                 <div className='openFile'>
//                     <button className='openFileButton' key={index} onClick={() => { openFile(file) }} >
//                         Otwórz
//                     </button>
//                 </div>
//             </li>
//         );
//     });

//     return (
//         <>
//             <ul id='listOfFiles'>
//                 {listOfFiles}
//             </ul>
//             <div className='newFileDiv'>
//                 <button className='newFileButton' onClick={() => { goToRecord() }}>Nowy plik</button>
//             </div>
//         </>
//     );

//     function openFile(file: File) {
//         console.log(file.download_url);
//         GetJSONFromRepo(file);
//     }

//     function GetJSONFromRepo(file: File) {
//         const owner = "miandrop";
//         const repo = "data";
//         const path = "files/translations/" + file.name;

//         const octokit = new Octokit({
//             auth: token,
//             baseUrl: "https://api.github.com",
//         });

//         const response = octokit.repos.getContent({
//             owner,
//             repo,
//             path,
//         }).then((response: any) => {

//             console.log(response.data);

//             //let Buffer = require("buffer").Buffer
//             let fileContent = (Buffer as any).from(response.data.content, "base64");
//             let JSONData: Array<Segment> = JSON.parse(fileContent);

//             console.log(JSONData);
//             setFile(JSONData);
//         });
//     }
// }