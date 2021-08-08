import * as ActionTypes from "./ActionTypes";

export const Login = (state = {
    inProgress: "idle",
    user: null,
    errMess: null
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_USERS:
            return { ...state, inProgress: "login_success", user: action.payload, errMess: null };

        case ActionTypes.LOGIN_SUCCESS:
            return { ...state, inProgress: "login_success", user: action.payload, errMess: null };

        case ActionTypes.LOGIN_IN_PROGRESS:
            return { ...state, inProgress: "login_inProgress", user: false, errMess: null };

        case ActionTypes.LOGIN_FAILED:
            return { ...state, inProgress: "login_failed", user: false, errMess: action.payload };


        case ActionTypes.SIGNUP_SUCCESS:
            return { ...state, inProgress: "signup_success", user: false, errMess: null };

        case ActionTypes.SIGNUP_IN_PROGRESS:
            return { ...state, inProgress: "signup_inProgress", user: false, errMess: null };

        case ActionTypes.SIGNUP_FAILED:
            return { ...state, inProgress: "signup_failed", user: false, errMess: action.payload };


        case ActionTypes.LOGIN_EDIT_SUCCESS:
            return { ...state, inProgress: "update_success", user: action.payload, errMess: null };

        case ActionTypes.LOGIN_EDIT_IN_PROGRESS:
            return { ...state, inProgress: "update_inProgress", errMess: null };

        case ActionTypes.LOGIN_EDIT_FAILED:
            return { ...state, inProgress: "update_failed", errMess: action.payload };

        case ActionTypes.LOGIN_EDIT_RESET:
            return { ...state, inProgress: "login_success", errMess: null };



        case ActionTypes.SIGNOUT:
            return { ...state, inProgress: false, user: false, errMess: null };

        default:
            return state;
    }
}
