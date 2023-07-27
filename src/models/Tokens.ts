export class Tokens {
    deepl: string;
    gitPublic: string;
    gitPrivate: string;
    isLogin: boolean;

    constructor(isLogin = false, deepl: string = "", gitPublic: string = "", gitPrivate: string = "") {
        this.isLogin = isLogin;
        this.deepl = deepl;
        this.gitPublic = gitPublic;
        this.gitPrivate = gitPrivate;
    }
}