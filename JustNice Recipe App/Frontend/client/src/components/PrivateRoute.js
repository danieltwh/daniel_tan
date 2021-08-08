import  React from  "react";
import { Component } from "react";
import { Route, Redirect } from  "react-router-dom";

export const  PrivateRoute =  ({componet: Component, ...rest}) => (
    <Route {...rest} render={props => 
        localStorage.getItem("authToken") ? (
            <Component {...props} />
        ) : (
            <Redirect to={{
                pathname: "/login",
                state: {from: props.location}
            }}
            />
        )}
        />
)