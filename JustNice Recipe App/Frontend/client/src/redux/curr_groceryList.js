import * as ActionTypes from "./ActionTypes";
import {RECIPES} from "../shared/recipes";

export const Curr_GroceryList = (state = {
        inProgress: "idle",
        errMess: null,
        grocery: {
            "list_name":"",
            "Grain, nuts and baking products": [],
            "Pasta, rice and pulses": [],
            "Vegetables":[],
            "Fruits": [],
            "Eggs, milk and milk products": [],
            "Meat, sausages and fish": [],
            "Herbs and spices": [],
            "Fats and oils": [],
            "Others": []
        }
    }, action) => {
        switch(action.type) {
            case ActionTypes.LOAD_LIST_SUCCESS:
                return {...state, inProgress: "success", grocery: action.payload};
            
            case ActionTypes.LOAD_LIST_IN_PROGRESS:
                return {...state, inProgress: "loading", errMess: null};
            
            case ActionTypes.LOAD_LIST_FAILED:
                return {...state, inProgress: "failed", errMess: action.payload};
            
            case ActionTypes.LOAD_LIST_RESET:
                return {...state, inProgress: "idle", errMess: action.payload, grocery: {
                    "list_name":"",
                    "Grain, nuts and baking products": [],
                    "Pasta, rice and pulses": [],
                    "Vegetables":[],
                    "Fruits": [],
                    "Eggs, milk and milk products": [],
                    "Meat, sausages and fish": [],
                    "Herbs and spices": [],
                    "Fats and oils": [],
                    "Others": []
                } };
        
            default:
                return state;
        }
}
