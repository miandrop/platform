import FileBrowser from './FileBrowser';
import Record from './Record';
import View from './View';
import './css/Hub.css'
import { useState } from 'react';
import { Segment } from './models/Segment';
import axios from 'axios';
import { Endpoints, OctokitResponse } from "@octokit/types";
import { Octokit } from "@octokit/rest";
import { Buffer } from "buffer";
import { Tokens } from "./models/Tokens";
import { OctokitInfo } from "./models/OctokitInfo";

export default function Hub() {
    const [fileToView, setFileToView] = useState<Array<Segment> | null>(null);
    const [isRecord, setIsRecord] = useState<boolean>(true);// false
    const [tokens, setTokens] = useState<Tokens>(new Tokens());
    const [octokitInfo, setOctokitInfo] = useState<OctokitInfo>(new OctokitInfo("", "github_pat_11AYN4LWY0zCzPpV0naqvV_1nYZdMZkNX2ZfwG4167vHoGbv00O3727dgdyFzfSfhkZOTTR53"));

    const partOfToken = "github_pat_11AYN4LWY0zCzPpV0naqvV_1nYZdMZkNX2ZfwG4167vHoGbv00O3727dgdyFzfSfhkZOTTR53";

    return (
        <>
            <header>
                {
                    tokens.isLogin == false ?
                        <div id='login'>
                            <input type='text' id='login-input'></input>
                            <button id='login-button' onClick={login}>Zaloguj</button>
                        </div> :
                        <div>
                            <button id='logout-button' onClick={logout}>Wyloguj</button>
                        </div>
                }
            </header>

            <section>
                {
                    (fileToView && <View meaningData={fileToView} goReturn={returnFromView} ></View>) ||
                    (isRecord && <Record goReturn={returnFromRecord} tokens={tokens} octokitInfo={octokitInfo}></Record>) ||
                    (<FileBrowser setFile={setStateForFile} goToRecord={setStateForIsRecord} tokens={tokens}></FileBrowser>)
                }
            </section>

            <footer></footer>
        </>
    );

    function setStateForFile(fileData: Array<Segment>) {
        setFileToView(fileData);
    }

    function setStateForIsRecord() {
        setIsRecord(true);
    }

    function returnFromView() {
        setFileToView(null);
    }

    function returnFromRecord() {
        setIsRecord(false);
    }

    async function login() {
        let backPartOfToken = (document.getElementById("login-input") as HTMLInputElement).value;

        if (backPartOfToken.length > 0) {
            const tokenToCheck = partOfToken + backPartOfToken;

            try {
                const response = await axios.get('https://api.github.com/user', {
                    headers: {
                        Authorization: `token ${tokenToCheck}`,
                    },
                });

                if (response.status === 200) {
                    const path = "Secrets/trans.json";

                    const octokit = new Octokit({
                        auth: tokenToCheck,
                        baseUrl: "https://api.github.com",
                    });

                    const response = octokit.repos.getContent({
                        owner: octokitInfo.owner,
                        repo: octokitInfo.privateRepoName,
                        path,
                    }).then((response: any) => {
                        let fileContent = Buffer.from(response.data.content, "base64");

                        let tokensInfo: Tokens = JSON.parse(fileContent.toString()).trans;
                        tokensInfo.gitPrivate = tokenToCheck;
                        tokensInfo.isLogin = true;

                        setTokens(tokensInfo);
                        setOctokitInfo(new OctokitInfo(tokensInfo.gitPrivate, tokensInfo.gitPublic));
                    });
                } else {
                    alert("nieprawidlowe dane logowania")
                }
            } catch (error) {
                console.error('Błąd zapytania do GitHub API:', error);
            }
        }
    }

    function logout() {
        setTokens(new Tokens());
        setOctokitInfo(new OctokitInfo("", ""));
    }
}