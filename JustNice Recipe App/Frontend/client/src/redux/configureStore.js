import { createStore, combineReducers,applyMiddleware } from 'redux';
import { createForms } from "react-redux-form";
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import throttle from 'lodash/throttle';

import {Login} from "./login";
import {Recipes} from "./recipes";
import {My_recipes} from "./my_recipes";

import { InitialSignForm } from './forms';
import { Curr_recipe } from './curr_recipe';
import { GroceryList } from './groceryList';
import { Curr_GroceryList } from './curr_groceryList';
import {Images} from './images';

import { loadState,  saveState } from './localStorage';

const persistedState = loadState();

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            login: Login,
            recipes: Recipes,
            my_recipes: My_recipes,
            curr_recipe: Curr_recipe,
            groceryList: GroceryList,
            curr_grocList : Curr_GroceryList,
            images: Images,
            ...createForms({
                signupForm: InitialSignForm
            })
        }),
        persistedState,
        applyMiddleware(thunk, logger)
    );

    store.subscribe(throttle(() => {
        var loginState = store.getState().login;
        // alert("Saving state")
       
        saveState({
            login: store.getState().login,
            images: store.getState().images,
        });
        

    }, 1000));
    
    return store;
};
