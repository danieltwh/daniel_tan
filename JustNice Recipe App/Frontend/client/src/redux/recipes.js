import * as ActionTypes from "./ActionTypes";
import {RECIPES} from "../shared/recipes";

export const Recipes = (state = {
        inProgress: "idle",
        errMess: null,
        recipes: []
    }, action) => {
        switch(action.type) {
            case ActionTypes.LOAD_RECIPES:
                return {...state, inProgress: "inProgress", recipes: []};
            
            case ActionTypes.LOAD_RECIPES_IN_PROGRESS:
                return {...state, inProgress: "inProgress", errMess: null, recipes: []};
            
            case ActionTypes.LOAD_RECIPES_FAILED:
                return {...state, inProgress: "failed", errMess: action.payload};
            
            case ActionTypes.LOAD_RECIPES_SUCCESS:
                return {...state, inProgress: "success", recipes: action.payload};

            case ActionTypes.LOAD_RECIPES_RESET:
                return {...state, inProgress: "idle", errMess: null, recipes: state.recipes };
        
            default:
                return state;
        }
}
