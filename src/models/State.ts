import { OctokitInfo } from "./OctokitInfo";
import { Tokens } from "./Tokens";

export class State {
    isLogin: boolean;
    isLogging: boolean;
    octokitInfo: OctokitInfo;
    tokens: Tokens;

    constructor() {
        this.isLogin = false;
        this.isLogging = false;

        this.octokitInfo = new OctokitInfo("", "");
        this.tokens = new Tokens();
    }
}