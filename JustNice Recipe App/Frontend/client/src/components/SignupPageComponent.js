import React, { Component } from 'react';
import { Col, Row, Navbar, NavbarBrand, Button, Form, FormGroup, FormFeedback, FormText, Label, Input } from 'reactstrap';
// import  {Form} from "react-bootstrap";
import {LocalForm, Control, Errors} from "react-redux-form";
import { Redirect } from 'react-router';
import { withRouter } from 'react-router';
import { connect } from "react-redux";

import { baseUrl } from '../shared/baseUrl';
import {login_attempt, signup_attempt, signup_failed, signup_inProgress, signup_success} from "../redux/ActionCreators";
import Loading from "./LoadingComponent";

import Alert from '@material-ui/lab/Alert';

const minLength = (len) => (value) => value && (value.length >= len);
const maxLength = (len) => (value) => !(value) || (value.length <= len);
const required = value => value && (value.length);
const email_re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const mapStateToProps = state => {
    return {
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => ({
    signup_attempt: (first_name, last_name, email, username, password) => dispatch(signup_attempt(first_name, last_name, email, username, password)),
    signup_success: () => dispatch(signup_success()),
    signup_inProgress: () => dispatch(signup_inProgress()),
    signup_failed: () => dispatch(signup_failed("Signup failed. Please try again.")),
    login_attempt: (username, password) => dispatch(login_attempt(username, password)),

    
});


class SignupPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            username: "",
            password: "",
            confirm_password: ""
            , validate: {
                first_name: "",
                last_name: "",
                email: "",
                username: "",
                password: "",
                confirm_password:""
            }
            ,isLoading: false
        }
        this.handleSignup = this.handleSignup.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        this.setState({
            [name]: value,
        });
    }

    handleUsernameChange(event) {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        const no_whitespace = /^\S+$/;

        var result;
        if (value.length ===0 ){
            result = "has-danger";
        } else if (!no_whitespace.test(value)){
            result = "white-space"
        } else {
            result = "inProgress"
        }

        this.setState({
            [name]: value,
            validate: {...this.state.validate, [name]: result}
        });
    }


    validateName(event) {
        const {target} = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const {name} = target;
        const no_whitespace = /^\S+$/
        const result = (value.length > 0 && no_whitespace.test(value));
        if (result) {
            this.setState({validate: {...this.state.validate, [name]:"has-success"}});
        } else if (value.length === 0) {
            this.setState({validate: {...this.state.validate, [name]:"has-danger"}});
        } else {
            this.setState({validate: {...this.state.validate, [name]:"white-space"}});
        }
    }

    validateEmail(event) {
        const {target} = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const {name} = target;
        const no_whitespace = /^\S+$/
        const email_re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const result = (value.length > 0 && email_re.test(value) && no_whitespace.test(value));
        if (result) {
            this.setState({validate: {...this.state.validate, [name]:"has-success"}});
        } else if (value.length ===0 ){
            this.setState({validate: {...this.state.validate, [name]:"has-danger"}});
        } else if (!email_re.test(value)) {
            this.setState({validate: {...this.state.validate, [name]:"invalid-email"}});
        } else {
            this.setState({validate: {...this.state.validate, [name]:"white-space"}});
        }
    }

    validateUsername(event) {
        const {target} = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const {name} = target;
        const no_whitespace = /^\S+$/;

        const result = (no_whitespace.test(value) && value.length > 0);
        if (value.length ===0 ){
            this.setState({validate: {...this.state.validate, [name]:"has-danger"}});
        } else if (!no_whitespace.test(value)){
            this.setState({validate: {...this.state.validate, [name]:"white-space"}});
        } else {
            this.setState({validate: {...this.state.validate, [name]:"checking"}});
            fetch(baseUrl + "user/checkuser/", {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    "username": value
                })
            }).then(resp => resp.json())
            .then(resp => {
                if (resp.status === "Does not exist"){
                    this.setState({validate: {...this.state.validate, [name]:"has-success"}});
                    return resp;
                } else {
                    this.setState({validate: {...this.state.validate, [name]:"username-taken"}});
                    return resp;
                }   
            })
            .then(resp => {
                // console.log(resp)
            })
            .catch(err => {
                // console.log(err)
            });
        }
    }

    validatePassword(event){
        const {target} = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const {name} = target;
        const no_whitespace = /^\S+$/;
        const result = (no_whitespace.test(value) && value.length > 0);
        // alert(JSON.stringify(no_whitespace.test(value)));


        var confirmPassword = this.state.confirm_password;

        if (value.length ===0 ){
            this.setState({validate: {...this.state.validate, password:"has-danger"}});
        } else if (!no_whitespace.test(value)){
            //console.log("here");
            this.setState({validate: {...this.state.validate, password:"white-space"}});
        } else if (confirmPassword !== value) {
            //console.log(this.state.confirm_password);
            //console.log(value);
            //console.log(this.state.confirm_password !== value); 
            this.setState({validate: {...this.state.validate,  password: "has-success", confirm_password:"password-mismatch"}});
        } else {
            this.setState({validate: {...this.state.validate, password:"has-success", confirm_password: "has-success"}});
        }
    }

    validateConfirmPassword(event){
        const value = this.state.confirm_password;

        const {target} = event;
        const newValue = target.type === "checkbox" ? target.checked : target.value;
        const {name} = target;
    
        const no_whitespace = /^\S+$/;
        const result = (no_whitespace.test(value) && value.length > 0);

        if (value.length ===0 ){
            this.setState({validate: {...this.state.validate, confirm_password:"has-danger"}});
        } else if (!no_whitespace.test(value)){
            this.setState({validate: {...this.state.validate,  confirm_password:"white-space"}});
        } else if (newValue !== value) {
            this.setState({validate: {...this.state.validate,  confirm_password:"password-mismatch"}});
        } else {
            this.setState({validate: {...this.state.validate,  confirm_password:"has-success"}});
        }
    }

    validateConfirmPasswordOnChange(event){
        const {target} = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const {name} = target;
        const no_whitespace = /^\S+$/;
        const result = (no_whitespace.test(value) && value.length > 0);

        if (this.state.confirm_password === ""){
            this.setState({validate: {...this.state.validate, confirm_password:"has-danger"}});
        } else if (this.state.confirm_password !== value ) {
            this.setState({validate: {...this.state.validate,  confirm_password:"password-mismatch"}});
        } else {
            this.setState({validate: {...this.state.validate,  confirm_password:"has-success"}});
        }
    }

    validateNewConfirmPassword(event){
        const {target} = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const {name} = target;
        const no_whitespace = /^\S+$/;
        const result = (no_whitespace.test(value) && value.length > 0);

        if (value.length ===0 ){
            this.setState({validate: {...this.state.validate, confirm_password:"has-danger"}});
        } else if (!no_whitespace.test(value)){
            this.setState({validate: {...this.state.validate,  confirm_password:"white-space"}});
        } else if (this.state.password !== value) {
            this.setState({validate: {...this.state.validate,  confirm_password:"password-mismatch"}});
        } else {
            this.setState({validate: {...this.state.validate,  confirm_password:"has-success"}});
        }
    }


    handleSignup(event) {
        event.preventDefault();

        // console.log("Username: " + this.state.username + " Password: " + this.state.password);
        // alert("Username: " + this.state.username + " Password: " + this.state.password);

        // console.log(JSON.stringify(this.sate));
        // alert(JSON.stringify(this.state));

        // console.log("Firstname: " + this.state.first_name + " Lastname: " + this.state.last_name + " Email: " + this.state.email +
        // " Username: " + this.state.username + " Password: " + this.state.password)

        // alert("Firstname: " + this.state.first_name + " Lastname: " + this.state.last_name + " Email: " + this.state.email +
        // " Username: " + this.state.username + " Password: " + this.state.password)

        var username = this.state.username;
        var password = this.state.password; 

        this.props.signup_inProgress();

        return fetch(baseUrl + "user/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "first_name": this.state.first_name, 
                "last_name": this.state.last_name,
                "email": this.state.email,
                "username": this.state.username,
                "password": this.state.password
            })
        })
        .then(resp => resp.json())
        .then(resp => {
            //console.log(JSON.stringify(resp));
            if (resp === "Added Successfully") {
                // this.props.signup_success().then(() => this.props.login_attempt(username, password))
                // .then(() => <Redirect to="/explore" /> );

                this.props.login_attempt(username, password)
                .then(() => <Redirect to="/explore" /> );
            }
        })
        .catch(err => {
            this.props.signup_failed();
            //console.log(err)
        });
    }

    validate() {
        const email_re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const has_whitespace = /\s/;
        const validation = {
            first_name: (this.state.first_name!=="" && this.state.first_name.length > 0) ? true : false,
            last_name: (this.state.last_name!=="" && this.state.last_name.length > 0 ) ? true : false,
            email: (this.state.email!=="" && this.state.email.length > 0 && email_re.test(this.state.email)) ? true : false,
            username: (this.state.username !== "" && this.state.username),
            password: true
        }
        return validation;
    }

    renderSignupForm() {
        //console.log(JSON.stringify(this.state))
        
        // const validation = this.validate();
        // //console.log(JSON.stringify(validation))

        const canSubmit = (this.state.validate.first_name === "has-success" && this.state.validate.last_name === "has-success" &&
            this.state.validate.email === "has-success"  && this.state.validate.username === "has-success" && this.state.validate.password === "has-success" &&
            this.state.validate.confirm_password === "has-success");

        return (

            <Form className="form" onSubmit={this.handleSignup}>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="first_name">Firstname</Label>
                            <Input type="text" name="first_name" id="first_name" placeholder="" 
                                valid={this.state.validate.first_name === "has-success"} 
                                invalid={this.state.validate.first_name === "has-danger" || this.state.validate.first_name === "white-space"}
                                onChange={(e) => {
                                    this.validateName(e);
                                    this.handleChange(e)}
                                    }
                                value={this.state.first_name}
                                onBlur={(e) => {
                                    this.validateName(e);
                                    this.handleChange(e)}}
                            />
                            {(() => {
                                if (this.state.validate.first_name === "has-danger"){
                                    return <FormFeedback>Required</FormFeedback>;
                                } else {
                                    return <FormFeedback>Spaces Not Allowed</FormFeedback>;
                                }
                            })()}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="last_name">Lastname</Label>
                            <Input type="text" name="last_name" id="last_name" placeholder="" 
                                valid={this.state.validate.last_name === "has-success"} 
                                invalid={this.state.validate.last_name === "has-danger" || 
                                    this.state.validate.last_name === "white-space"}
                                onChange={(e) => {
                                    this.validateName(e);
                                    this.handleChange(e)}
                                    }
                                value={this.state.last_name}
                                onBlur={(e) => {
                                    this.validateName(e);
                                    this.handleChange(e)}}
                            />
                            {(() => {
                                if (this.state.validate.last_name === "has-danger"){
                                    return <FormFeedback>Required</FormFeedback>;
                                } else {
                                    return <FormFeedback>Spaces Not Allowed</FormFeedback>;
                                }
                            })()}
                            
                        </FormGroup>
                    </Col>
                </Row>

           
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="email" id="email" placeholder="abc@gmail.com" 
                        valid={this.state.validate.email === "has-success"} 
                        invalid={this.state.validate.email === "has-danger" || this.state.validate.email === "invalid-email" || 
                            this.state.validate.email === "white-space"}
                        onChange={(e) => {
                            this.validateEmail(e);
                            this.handleChange(e)}
                            }
                        value={this.state.email}
                        onBlur={(e) => {
                            this.validateEmail(e);
                            this.handleChange(e)}}
                    />
                    {(() => {
                        if (this.state.validate.email === "has-danger"){
                            return <FormFeedback>Required</FormFeedback>;
                        } else if (this.state.validate.email === "invalid-email") {
                            return <FormFeedback>Invalid Email Format</FormFeedback>;
                        }else {
                            return <FormFeedback>Spaces Not Allowed</FormFeedback>;
                        }
                    })()}
                </FormGroup>

                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input type="username" name="username" id="username" placeholder="" 
                        valid={this.state.validate.username === "has-success"} 
                        invalid={this.state.validate.username === "has-danger" || this.state.validate.username === "white-space" || 
                            this.state.validate.username === "username-taken" || this.state.validate.username === "checking"}
                        onChange={(e) => {
                            this.handleUsernameChange(e);
                            }}
                        value={this.state.username}
                        onBlur={(e) => {
                            this.validateUsername(e);
                            this.handleChange(e)}}
                    />
                    {(() => {
                        if (this.state.validate.username === "has-danger"){
                            return <FormFeedback>Required</FormFeedback>;
                        } else if (this.state.validate.username === "username-taken") {
                            return <FormFeedback>Username Already In Use</FormFeedback>;
                        }else if (this.state.validate.username === "white-space") {
                            return <FormFeedback>Spaces Not Allowed</FormFeedback>;
                        } else {
                            return <FormFeedback>Hold On... Checking if Username is in use</FormFeedback>;
                        }
                    })()}
                </FormGroup>

                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" id="password" placeholder="" 
                        valid={this.state.validate.password === "has-success"} 
                        invalid={this.state.validate.password === "has-danger" || this.state.validate.password === "white-space"}
                        onChange={(e) => {
                            this.validatePassword(e);
                            this.handleChange(e);
                            // this.validateConfirmPassword(e);
                            // this.handlePasswordChange(e);
                            // this.validateConfirmPasswordOnChange(e);
                            }}
                        onBlur={(e) => {
                            // this.validatePassword(e);
                            this.handleChange(e)}}
                    />
                    {(() => {
                        if (this.state.validate.password === "has-danger"){
                            return <FormFeedback>Required</FormFeedback>;
                        }else{
                            return <FormFeedback>Spaces Not Allowed</FormFeedback>;
                        }
                    })()}
                </FormGroup>

                <FormGroup>
                    <Label for="confirm_password">Confirm Password</Label>
                    <Input type="password" name="confirm_password" id="confirm_password" placeholder="" 
                        valid={this.state.validate.confirm_password === "has-success"} 
                        invalid={this.state.validate.confirm_password === "has-danger" || this.state.validate.confirm_password === "white-space" || 
                            this.state.validate.confirm_password === "password-mismatch"}
                        onChange={(e) => {
                            this.handleChange(e)
                            this.validateNewConfirmPassword(e);
                            }}
                        value={this.state.confirm_password}
                        onBlur={(e) => {
                            this.handleChange(e);
                            this.validateNewConfirmPassword(e);
                            }}
                    />
                    {(() => {
                        if (this.state.validate.confirm_password === "has-danger"){
                            return <FormFeedback>Required</FormFeedback>;
                        }else if (this.state.validate.confirm_password === "white-space") {
                            return <FormFeedback>Spaces Not Allowed</FormFeedback>;
                        } else if (this.state.validate.confirm_password === "password-mismatch"){
                            return <FormFeedback>Password Do Not Match</FormFeedback>;
                        }
                    })()}
                </FormGroup>
        
                {/* <FormGroup check>
                    <Input type="checkbox" name="check" id="exampleCheck"/>
                    <Label for="exampleCheck" check>I accept the Terms of Use & Privacy Policy</Label>
                </FormGroup> */}
                
                <button type="submit" className="signup-button btn btn-primary pull-right" disabled={!canSubmit}>Sign Up</button>
            </Form>
        )
    }

    render() {
        return (
            <div className="signup-bg">
                <div className="signup-form">
                    <div className="container">
                        <h2>Sign Up</h2>
                        <p>Please fill in this form to create an account!</p>
                        <hr />

                        {(() => {
                            if (this.props.login.inProgress === "signup_failed") {
                                return <Alert severity="error">{(this.props.login.errMess !== null) ? 
                                (this.props.login.errMess) : 
                                "Failed to signup. Please try again"}</Alert>;
                            } else if (this.props.login.inProgress === "signup_inProgress" || this.props.login.inProgress === "login_inProgress") {
                                return (
                                    <>
                                        <Alert severity="info">Hold on...signup in progress!</Alert>
                                        <Loading />
                                    </>
                                )
                            } else if (this.props.login.inProgress === "login_success"){
                                return (
                                    <>
                                        <Alert severity="success">Signup successful! Serving up some recipes now...</Alert>
                                        <Loading />
                                    </>
                                )
                            }
                        })()}

                        {this.renderSignupForm()}
                    </div>
                </div>
                
            </div>
            
        );
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignupPage));
