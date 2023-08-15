import { OctokitInfo } from "./models/OctokitInfo";
import { State } from "./models/State";
import { Tokens } from "./models/Tokens";

export default function reducer(state: State, action: Action): State
{
    switch(action.type)
    {
        case ActionType.Logging: return {...state, isLogging: true}
        case ActionType.Logout: return logout(state);
        default: return state;
    }
}

function logout(state: State): State
{
    return {...state, tokens: new Tokens(), octokitInfo: new OctokitInfo("", "")  };
}