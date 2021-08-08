import * as ActionTypes from "./ActionTypes";
import {RECIPES} from "../shared/recipes";

export const GroceryList = (state = {
        inProgress: "idle",
        errMess: null,
        groceryList: []
    }, action) => {
        switch(action.type) {
            case ActionTypes.LOAD_GROCERYLIST_SUCCESS:
                return {...state, inProgress: "success", groceryList: action.payload};
            
            case ActionTypes.LOAD_GROCERYLIST_IN_PROGRESS:
                return {...state, inProgress: "loading", errMess: null, groceryList: []};
            
            case ActionTypes.LOAD_GROCERYLIST_FAILED:
                return {...state, inProgress: "failed", errMess: action.payload};
            
            case ActionTypes.LOAD_GROCERYLIST_RESET:
                return {...state, inProgress: "idle", errMess: null, groceryList:[]}
        
            default:
                return state;
        }
}
