import * as ActionTypes from "./ActionTypes";
import {MY_RECIPES} from "../shared/my_recipes";

export const Curr_recipe = (state = {
        inProgress: "idle",
        errMess: null,
        recipe: null
    }, action) => {
        switch(action.type) {
            case ActionTypes.GET_RECIPE_SUCCESS:
                return {...state, inProgress: "success", recipe: action.payload};
            
            case ActionTypes.GET_RECIPE_IN_PROGRESS:
                return {...state, inProgress: "loading", errMess: null, recipe: null};
            
            case ActionTypes.GET_RECIPE_FAILED:
                return {...state, inProgress: "failed", errMess: action.payload};

            case ActionTypes.GET_RECIPE_RESET:
                return {...state, inProgress: "idle", errMess: null, recipe: null};

            case ActionTypes.UPDATE_RECIPE_IN_PROGRESS:
                return {...state, inProgress: "updating", errMess: null};
            
            case ActionTypes.UPDATE_RECIPE_SUCCESS:
                return {...state, inProgress: "update_success", errMess: null};
            
            case ActionTypes.UPDATE_RECIPE_FAILED:
                return {...state, inProgress: "update_failed", errMess: action.payload};
        
            default:
                return state;
        }
}
