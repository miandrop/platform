import { Octokit } from "@octokit/rest";

export class OctokitInfo {
    readonly owner: string = "miandrop";
    readonly publicRepoName: string = "data-public";
    readonly privateRepoName: string = "data";
    octokitPublic: Octokit;
    octokitPrivate: Octokit;

    constructor(privateToken: string, publicToken: string) {
        this.octokitPublic = new Octokit({
            auth: publicToken,
            baseUrl: "https://api.github.com",
        });

        this.octokitPrivate = new Octokit({
            auth: privateToken,
            baseUrl: "https://api.github.com",
        });
    }
}