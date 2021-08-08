import * as ActionTypes from "./ActionTypes";
import { fetch } from "cross-fetch";

import { baseUrl } from "../shared/baseUrl";

import { USERS } from "../shared/users";

function getCurrentDate(separator = '') {

    var newDate = new Date()
    var date = newDate.getDate();
    var month = newDate.getMonth() + 1;
    var year = newDate.getFullYear();
    var h = newDate.getHours();
    var m = newDate.getMinutes();
    var s = newDate.getSeconds();

    return `${date}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${year} - ${h}:${m}${separator}:${s}`
    // return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}${separator}${h}${separator}${m}${separator}${s}`
  }


/* Login */
export const login_attempt = (username, password) => (dispatch) => {
    dispatch(login_inProgress());
    
    return fetch(baseUrl + "user/login/"
        , {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
        .then(response => {
            // console.log(response);
            // console.log(JSON.stringify(response.json()));
            return response.json()
        })
        .then(resp => {
            //console.log(resp);
            if (resp.status === 1) {
                // return add_users(users);
                dispatch(login_success(resp.user));
                dispatch(load_profile_image(resp.user.id));
            } else if (resp.status === 0) {
                dispatch(login_failed("Wrong Password"));
            } else {
                dispatch(login_failed("Username Does Not Exist"));
            }
        })
        .catch(error => {
            dispatch(login_failed("Failed to login. Please try again"));
            //console.log(error.message)
        });
};

export const login_inProgress = () => ({
    type: ActionTypes.LOGIN_IN_PROGRESS,
});

export const login_success = (user) => ({
    type: ActionTypes.LOGIN_SUCCESS,
    payload: user
});

export const login_failed = (errMess) => ({
    type: ActionTypes.LOGIN_FAILED,
    payload: errMess
});

export const add_users = (users) => ({
    type: ActionTypes.ADD_USERS,
    payload: users
});

export const signup_attempt = (first_name, last_name, email, username, password) => (dispatch) => {
    dispatch(signup_inProgress())

    return fetch(baseUrl + "user/"
        , {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "username": username,
                "password": password
            })
        }
    )
        .then(response => {
            return response.json()
        })
        .catch(error => {
            //console.log(error.message)
        });
};

export const signup_inProgress = () => ({
    type: ActionTypes.SIGNUP_IN_PROGRESS,
});

export const signup_success = (user) => ({
    type: ActionTypes.SIGNUP_SUCCESS,
    payload: user
});

export const signup_failed = (errMess) => ({
    type: ActionTypes.SIGNUP_FAILED,
    payload: "Failed to signup. Please try again."
});

export const login_edit_attempt = (userId, first_name, last_name, email, username, password) => (dispatch) => {

    dispatch(login_edit_inProgress(true));

    var newInfo = {
        "id": userId,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "username": username,
    }

    if (password !== null) {
        newInfo["password"] = password
    }


    // alert(JSON.stringify(newInfo));

    return fetch(baseUrl + "user/"
        , {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newInfo)
        })
        .then(response => response.json())
        .then(response => {
            // console.log(JSON.stringify(response));
            // alert(JSON.stringify(response));
            // alert(response)
            if (response === "Updated Successfully") {
                dispatch(login_edit_success(newInfo));

            } else {
                dispatch(login_edit_failed(response.message));
            }
        })
        .catch(error => {
            //console.log(error.message);
        })
};

export const login_edit_inProgress = () => ({
    type: ActionTypes.LOGIN_EDIT_IN_PROGRESS,
});

export const login_edit_success = (user) => ({
    type: ActionTypes.LOGIN_EDIT_SUCCESS,
    payload: user
});

export const login_edit_failed = (errMess) => ({
    type: ActionTypes.LOGIN_EDIT_FAILED,
    payload: "Failed"
});

export const login_edit_reset = (errMess) => ({
    type: ActionTypes.LOGIN_EDIT_RESET
});


export const signout = () => {
    //console.log("signout triggered")

    return ({
        type: ActionTypes.SIGNOUT
    });
}

export const load_myrecipes = (user_id) => (dispatch) => {
    dispatch(load_myrecipes_inProgress(true));

    return fetch(baseUrl + "recingred/getallrec/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "user_id": user_id,
        })
    })
        .then(resp => resp.json())
        .then(resp => {
            //console.log(resp);
            if (resp.length >= 0) {
                // return add_users(users);
                dispatch(load_myrecipes_success(resp));
            } else {
                dispatch(load_myrecipes_failed("Failed to load your recipes. Please try again."));
            }
        })
}

export const load_myrecipes_inProgress = () => ({
    type: ActionTypes.LOAD_MY_RECIPES_IN_PROGRESS
});

export const load_myrecipes_success = (recipes) => ({
    type: ActionTypes.LOAD_MY_RECIPES,
    payload: recipes
});

export const load_myrecipes_failed = () => ({
    type: ActionTypes.LOAD_MY_RECIPES_FAILED
})

export const load_myrecipes_reset = () => ({
    type: ActionTypes.LOAD_MY_RECIPES_RESET
})


export const get_recipe = (rec_id) => (dispatch) => {
    dispatch(get_recipe_inProgress(true));

    return fetch(baseUrl + "recingred/getfullrec/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "rec_id": rec_id,
        })
    })
        .then(resp => resp.json())
        .then(resp => {
            // //console.log(JSON.stringify(resp));
            if (true) {
                // return add_users(users);
                dispatch(get_recipe_success(resp));
            } else {
                dispatch(get_recipe_failed("Error"));
            }
        })
        .catch(err => {
            dispatch(get_recipe_failed("Error"));
            //console.log(err)
        });
}

export const get_recipe_inProgress = () => ({
    type: ActionTypes.GET_RECIPE_IN_PROGRESS
});

export const get_recipe_success = (recipe) => ({
    type: ActionTypes.GET_RECIPE_SUCCESS,
    payload: recipe
});

export const get_recipe_failed = (errMess) => ({
    type: ActionTypes.GET_RECIPE_FAILED,
    payload: errMess
})

export const get_recipe_reset = () => ({
    type: ActionTypes.GET_RECIPE_RESET
})


export const update_recipe = (newRecipe, user_id) => (dispatch) => {
    dispatch(update_recipe_inProgress(true));

    // var ingredients = [];
    var count = -1;
    var ingredients = newRecipe.ingredient.map(curr => {
        if (curr.isValid === "valid") {
            // ingredients.push({`${curr.ingred_id}`: curr.ingred_quantity})
            // ingredients[`${curr.ingred_id}`] = curr.ingred_quantity;

            var nextItem = {}
            nextItem[`${curr.ingred_id}`] = curr.ingred_quantity;
            return nextItem;
        } else {
            // ingredients[`${count}`] = {
            //     "ingred_name": curr.ingred_name,
            //     "ingred_unit": curr.ingred_unit,
            //     "ingred_quantity": curr.ingred_quantity
            // };
            var nextItem = {}
            nextItem[`${count}`] = {
                "ingred_name": curr.ingred_name,
                "ingred_unit": curr.ingred_unit,
                "ingred_quantity": curr.ingred_quantity
            }
            count = count - 1;
            return nextItem;
        }
    })

    // console.log(JSON.stringify(ingredients));
    // alert(JSON.stringify(ingredients));

    var toSend = {
        "rec_name": newRecipe.rec_name,
        "rec_instructions": newRecipe.rec_instructions,
        "cooking_time": newRecipe.cooking_time,
        "serving_pax": newRecipe.serving_pax,
        "cuisine": newRecipe.cuisine,
        "rec_type": newRecipe.rec_type,
        "isPublished": newRecipe.isPublished,
        "user_id": user_id,
        "ingredients": ingredients
    }

    // alert(JSON.stringify(newRecipe));
    // alert(JSON.stringify(toSend));

    if (newRecipe.rec_id === "new") {
        return fetch(baseUrl + "recingred/recipe/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toSend)
        })
            .then(resp => resp.json())
            .then(resp => {
                // console.log(JSON.stringify(resp));
                if (resp.status === 1) {
                    // return add_users(users);
                    dispatch(update_recipe_success());
                } else {
                    dispatch(update_recipe_failed("Error"));
                }
            })
            .catch(err => {
                // alert(err);
                dispatch(update_recipe_failed("Error"))
                //console.log(err)
            });
    } else {
        return fetch(baseUrl + "recingred/recipe/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "rec_id": newRecipe.rec_id,
                "rec_name": newRecipe.rec_name,
                "rec_instructions": newRecipe.rec_instructions,
                "cooking_time": newRecipe.cooking_time,
                "serving_pax": newRecipe.serving_pax,
                "cuisine": newRecipe.cuisine,
                "rec_type": newRecipe.rec_type,
                "isPublished": newRecipe.isPublished,
                "user_id": user_id,
                "ingredients": ingredients
            })
        })
            .then(resp => resp.json())
            .then(resp => {
                // console.log(JSON.stringify(resp));
                if (resp.status === 1) {
                    // return add_users(users);
                    dispatch(update_recipe_success(true));
                    return true;

                } else {
                    dispatch(update_recipe_failed("Failed to update recipe. Please try again."));
                    return false;
                }
            })
            // .then(resp => {
            //     if(resp){
            //         dispatch(get_recipe_reset());
            //         dispatch(load_recipe_image_reset());
            //     }
            // })
            .catch(err => {
                // alert(err);
                dispatch(update_recipe_failed("Failed to update recipe. Please try again."));
                //console.log(err)
            });
    }
}

export const update_recipe_inProgress = () => ({
    type: ActionTypes.UPDATE_RECIPE_IN_PROGRESS
});

export const update_recipe_failed = (errMess) => ({
    type: ActionTypes.UPDATE_RECIPE_FAILED,
    payload: errMess
});

export const update_recipe_success = () => ({
    type: ActionTypes.UPDATE_RECIPE_SUCCESS
});

/***** Delete Recipe *********/
export const delete_recipe = (userId, recipeId) => (dispatch) => {
    dispatch(delete_recipe_inProgress())
    
    return fetch(baseUrl + "recingred/recipe/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "rec_id": recipeId,
        })
    })
    .then(resp => resp.json())
    .then(resp => {
        if(resp.status === "Deleted successfully"){
            dispatch(load_myrecipes(userId))
        } else {
            dispatch(delete_recipe_failed("Failed to delete recipe. Please try again."))
        }
    })
    .catch(err => {
        dispatch(delete_recipe_failed(err));
        //console.log(err);
    })
}

export const delete_recipe_inProgress = () => ({
    type: ActionTypes.DELETE_RECIPE_IN_PROGRESS
});

export const delete_recipe_failed = (errMess) => ({
    type: ActionTypes.DELETE_RECIPE_FAILED,
    payload: errMess
});

export const udelete_recipe_success = () => ({
    type: ActionTypes.DELETE_RECIPE_SUCCESS
});



/***** Loading My Grocery List *********/
export const load_myGrocList = (user_id) => (dispatch) => {
    dispatch(load_myGrocList_inProgress(true));
    return fetch(baseUrl + `groclist/getter/${user_id}`)
        .then(resp => resp.json())
        .then(resp => {
            // console.log(JSON.stringify(resp));
            if (resp.length >= 0) {
                // return add_users(users);
                dispatch(load_myGrocList_success(resp));
            } else {
                dispatch(load_myGrocList_failed("Error"));
            }
        })
        .catch(err => {
            // alert(err);
            load_myGrocList_failed(err)
            //console.log(err)
        });

}

export const load_myGrocList_inProgress = () => ({
    type: ActionTypes.LOAD_GROCERYLIST_IN_PROGRESS
});

export const load_myGrocList_success = (grocList) => ({
    type: ActionTypes.LOAD_GROCERYLIST_SUCCESS,
    payload: grocList
});

export const load_myGrocList_failed = (errMess) => ({
    type: ActionTypes.LOAD_GROCERYLIST_FAILED,
    payload: errMess
})

export const load_myGrocList_reset = () => ({
    type: ActionTypes.LOAD_GROCERYLIST_RESET
})

/***** Creating new Grocery List *********/
export const create_new_GrocList = (user_id, list_id) => (dispatch) => {
    // dispatch(load_myGrocList_inProgress(true));

    // alert(JSON.stringify({ "user_id": user_id, "list_id": list_id }));

    return fetch(baseUrl + `groclist/getter/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "user_id": user_id,
            "list_id": list_id,
            "list_name": `New List`
        })
    })
        .then(resp => resp.json())
        .then(resp => {
            //console.log(JSON.stringify(resp));
            if (resp.status === "New list created") {
                // return add_users(users);
                // dispatch(load_myGrocList(user_id));
                return {status: true, user_id: user_id, list_id: list_id}
            } else {
                dispatch(load_myGrocList_failed("Failed to create new list. Please try again."));
                return {status: false, user_id: user_id}
            }
        })
        .catch(err => {
            // alert(err);
            dispatch(load_myGrocList_failed("Failed to create new list. Please try again."));
            //console.log(err)
        });
}

/***** Loading Current Grocery List *********/
export const load_currGrocList = (user_id, grocList_id) => (dispatch) => {
    dispatch(load_currGrocList_inProgress(true));
    return fetch(baseUrl + `groclist/update/${user_id}/${grocList_id}`)
        .then(resp => resp.json())
        .then(resp => {
            // console.log(JSON.stringify(resp));
            if (Object.entries(resp).length >= 1) {
                // return add_users(users);
                dispatch(load_currGrocList_success(resp));
            } else {
                dispatch(load_currGrocList_failed("Error"));
            }
        })
        .catch(err => {
            // alert(err);
            dispatch(load_currGrocList_failed(err));
            //console.log(err)
        });
}

export const load_currGrocList_inProgress = () => ({
    type: ActionTypes.LOAD_LIST_IN_PROGRESS
});

export const load_currGrocList_success = (grocList) => ({
    type: ActionTypes.LOAD_LIST_SUCCESS,
    payload: grocList
});

export const load_currGrocList_failed = (errMess) => ({
    type: ActionTypes.LOAD_LIST_FAILED,
    payload: errMess
})

export const load_currGrocList_reset = () => ({
    type: ActionTypes.LOAD_LIST_RESET
})

/***** Loading Current Grocery List *********/


// export const update_currGrocList = ()

/***** Profile Image *********/
export const load_profile_image = (userId) => (dispatch) => {
    dispatch(load_profile_image_inProgress(true));

    // alert("Getting profile image")

    return fetch(baseUrl + "getphoto/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "filename": `user${userId}`,
        })
    })
        .then(resp => resp.json())
        .then(resp => {
            //console.log(JSON.stringify(resp));
            dispatch(load_profile_image_success(resp));
        })
        .catch(err => {
            dispatch(load_profile_image_failed(err));
            // alert(err);
            //console.log(err)
        });
}

export const load_profile_image_inProgress = () => ({
    type: ActionTypes.LOAD_PROFILE_IMG_PROGRESS
});

export const load_profile_image_success = (details) => ({
    type: ActionTypes.LOAD_PROFILE_IMG_SUCCESS,
    payload: details
});

export const load_profile_image_failed = (errMess) => ({
    type: ActionTypes.LOAD_PROFILE_IMG_FAILED,
    payload: errMess
})

export const load_profile_image_reset = () => ({
    type: ActionTypes.LOAD_PROFILE_IMG_RESET
})

export const update_profile_image = (userId, newImage) => (dispatch) => {
    dispatch(update_profile_image_inProgress(true));

    // alert(newImage);
    var formData = new FormData();

    formData.append("pic", newImage);
    formData.append("filename", `user${userId}`);

    return fetch(baseUrl + "updatephoto/", {
        method: "POST",
        body: formData
    })
        .then(resp => resp.json())
        .then(resp => {
            //console.log(JSON.stringify(resp));
            if (resp.status === "new") {
                dispatch(load_profile_image_success(resp));
                return resp;
            } else {
                dispatch(update_profile_image_failed("Failed to update image. Please try again."));
                return resp;
            }
        })
        .catch(err => {
            dispatch(update_profile_image_failed("Failed to update image. Please try again."));
            // alert(err);
            //console.log(err)
        });
}

export const update_profile_image_inProgress = () => ({
    type: ActionTypes.UPDATE_PROFILE_IMG_PROGRESS
});

export const update_profile_image_success = (details) => ({
    type: ActionTypes.UPDATE_PROFILE_IMG_SUCCESS,
    payload: details
});

export const update_profile_image_failed = (errMess) => ({
    type: ActionTypes.UPDATE_PROFILE_IMG_FAILED,
    payload: errMess
})


/***** Loading Recipe Image *********/
export const load_recipe_image = (recipeId) => (dispatch) => {
    dispatch(load_recipe_image_inProgress(true));

    // alert("Getting recipe image")

    return fetch(baseUrl + "getphoto/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "filename": `rec${recipeId}`,
        })
    })
        .then(resp => resp.json())
        .then(resp => {
            //console.log(JSON.stringify(resp));
            dispatch(load_recipe_image_success(resp));
        })
        .catch(err => {
            dispatch(load_recipe_image_failed(err));
            // alert(err);
            //console.log(err)
        });
}

export const load_recipe_image_inProgress = () => ({
    type: ActionTypes.LOAD_RECIPE_IMG_PROGRESS
});

export const load_recipe_image_success = (details) => ({
    type: ActionTypes.LOAD_RECIPE_IMG_SUCCESS,
    payload: details
});

export const load_recipe_image_failed = (errMess) => ({
    type: ActionTypes.LOAD_RECIPE_IMG_FAILED,
    payload: errMess
})

export const load_recipe_image_reset = () => ({
    type: ActionTypes.LOAD_RECIPE_IMG_RESET
})

export const load_recipe_image_default = () => ({
    type: ActionTypes.LOAD_RECIPE_IMG_DEFAULT
})

export const update_recipe_image = (recipeId, newImage) => (dispatch) => {
    dispatch(update_recipe_image_inProgress(true));

    // alert(newImage);
    var formData = new FormData();

    formData.append("pic", newImage);
    formData.append("filename", `rec${recipeId}`);

    return fetch(baseUrl + "updatephoto/", {
        method: "POST",
        body: formData
    })
        .then(resp => resp.json())
        .then(resp => {
            //console.log(JSON.stringify(resp));
            if (resp.status === "new") {
                dispatch(load_recipe_image_success(resp));
                return resp;
            } else {
                dispatch(update_recipe_image_failed("Failed to update image. Please try again."));
                return resp;
            }
        })
        .catch(err => {
            dispatch(update_recipe_image_failed("Failed to update image. Please try again."));
            // alert(err);
            //console.log(err)
        });
}

export const update_recipe_image_inProgress = () => ({
    type: ActionTypes.UPDATE_RECIPE_IMG_PROGRESS
});

export const update_recipe_image_success = (details) => ({
    type: ActionTypes.UPDATE_RECIPE_IMG_SUCCESS,
    payload: details
});

export const update_recipe_image_failed = (errMess) => ({
    type: ActionTypes.UPDATE_RECIPE_IMG_FAILED,
    payload: errMess
})



/***** Loading Explore Page *********/
export const load_explore_recipes = () => (dispatch) => {
    dispatch(load_explore_recipes_inProgress(true));
    return fetch(baseUrl + `recingred/search/`)
        .then(resp => resp.json())
        .then(resp => {
            // //console.log(JSON.stringify(resp));
            if (resp.length > 0) {
                // return add_users(users);
                dispatch(load_explore_recipes_success(resp));
            } else {
                dispatch(load_explore_recipes_failed("Sorry, failed to load recipes. Please try again!"));
            }
        })
        .catch(err => {
            // alert(err);
            dispatch(load_explore_recipes_failed("Sorry, failed to load recipes. Please try again!"));
            //console.log(err)
        });

}

export const load_explore_recipes_inProgress = () => ({
    type: ActionTypes.LOAD_RECIPES_IN_PROGRESS
});

export const load_explore_recipes_success = (grocList) => ({
    type: ActionTypes.LOAD_RECIPES_SUCCESS,
    payload: grocList
});

export const load_explore_recipes_failed = (errMess) => ({
    type: ActionTypes.LOAD_RECIPES_FAILED,
    payload: errMess
})

export const load_explore_recipes_reset = () => ({
    type: ActionTypes.LOAD_RECIPES_RESET
})

/***** Searching Recipes *********/
export const search_recipes = (search) => (dispatch) => {
    // alert(search);
    dispatch(load_explore_recipes_inProgress(true));

    return fetch(baseUrl + `recingred/search/`, {
        method: "POST",
        body: JSON.stringify({
            "category": "recingred",
            "keywords": search,
        })
    })
        .then(resp => resp.json())
        .then(resp => {
            // console.log(JSON.stringify(resp));
            if (resp.length >= 0) {
                // return add_users(users);
                dispatch(load_explore_recipes_success(resp));
            } else {
                dispatch(load_explore_recipes_failed("Sorry, failed to load recipes. Please try again!"));
            }
        })
        .catch(err => {
            // alert(err);
            dispatch(load_explore_recipes_failed("Sorry, failed to load recipes. Please try again!"));
            //console.log(err)
        });
}

export const complex_search_recipes = (search) => (dispatch) => {
    // alert(search);
    dispatch(load_explore_recipes_inProgress(true));

    return fetch(baseUrl + `recingred/compsearch/`, {
        method: "POST",
        body: JSON.stringify(search)
    })
        .then(resp => resp.json())
        .then(resp => {
            // console.log(JSON.stringify(resp));
            if (resp.length >= 0) {
                // return add_users(users);
                dispatch(load_explore_recipes_success(resp));
            } else {
                dispatch(load_explore_recipes_failed("Sorry, failed to load recipes. Please try again!"));
            }
        })
        .catch(err => {
            // alert(err);
            dispatch(load_explore_recipes_failed("Sorry, failed to load recipes. Please try again!"));
            //console.log(err)
        });
}



