import React, { Component } from 'react';
import { Navbar, NavbarBrand, Button, Form, FormGroup, FormFeedback, Label, Input, Row, Col } from 'reactstrap';
import Alert from '@material-ui/lab/Alert';

import { withRouter } from 'react-router';
import { connect } from "react-redux";

import Loading from "./LoadingComponent";

function LoginPageHeader(props) {
    return (
        <div>
            <Navbar dark expand="md">
                <NavbarBrand href="/" className="navbar-brand-mobile">JustNice</NavbarBrand>
            </Navbar>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        login: state.login
    }
}

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            validate: {
                username: "",
                password: "",
            }
        }
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(event) {
        event.preventDefault();

        // console.log("Username: " + this.state.username + " Password: " + this.state.password);
        // alert("Username: " + this.state.username + " Password: " + this.state.password);
        this.props.login_attempt(this.state.username, this.state.password);

    }

    handleUsernameChange(event) {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        const no_whitespace = /^\S+$/;

        var result;
        if (value.length === 0) {
            result = "has-danger";
        } else if (!no_whitespace.test(value)) {
            result = "white-space"
        } else {
            result = "has-success"
        }

        this.setState({
            [name]: value,
            validate: { ...this.state.validate, [name]: result }
        });
    }

    handleChange(event) {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        this.setState({
            [name]: value,
        });
    }

    validatePassword(event) {
        const { target } = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const { name } = target;
        const no_whitespace = /^\S+$/;
        const result = (no_whitespace.test(value) && value.length > 0);
        // alert(JSON.stringify(no_whitespace.test(value)));


        if (value.length === 0) {
            this.setState({ validate: { ...this.state.validate, password: "has-danger" } });
        } else if (!no_whitespace.test(value)) {
            //console.log("here");
            this.setState({ validate: { ...this.state.validate, password: "white-space" } });
        } else {
            this.setState({ validate: { ...this.state.validate, password: "has-success", confirm_password: "has-success" } });
        }
    }

    isDisabled() {
        var test = (this.state.validate.username !== "has-success" || this.state.validate.password !== "has-success")
        //console.log(test);
        return test;
    }

    renderLoginForm() {
        //console.log(JSON.stringify(this.state));

        const loginDisabled = this.isDisabled();

        return (
            <div className="login-bg">
                <div className="login-form">
                    <div className="container">
                        <h2>Login</h2>
                        <p>Welcome back!</p>
                        <hr />

                        {(() => {
                            if (this.props.login.inProgress === "login_failed" && this.props.login.errMess !== null) {
                                return <Alert severity="error">{this.props.login.errMess}</Alert>;
                            } else if (this.props.login.inProgress === "login_inProgress") {
                                return (
                                    <>
                                        <Alert severity="info">Hold on...login in progress!</Alert>
                                        <Loading />
                                    </>
                                )
                            } else if (this.props.login.inProgress === "login_success"){
                                return <Alert severity="success">Login successful! Serving up some recipes now...</Alert>
                            }
                        })()}
                        <Form className="form" onSubmit={(event) => this.handleLogin(event)}>

                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type='text' id='username' name='username'

                                    invalid={this.state.validate.username === "has-danger" || this.state.validate.username === "white-space"}
                                    onChange={(event) => this.handleUsernameChange(event)}
                                />

                                {(() => {
                                    if (this.state.validate.password === "has-danger") {
                                        return <FormFeedback>Required</FormFeedback>;
                                    } else {
                                        return <FormFeedback>Spaces Not Allowed</FormFeedback>;
                                    }
                                })()}
                            </FormGroup>




                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type='password' id='password' name='password'

                                    invalid={this.state.validate.password === "has-danger" || this.state.validate.password === "white-space"}
                                    onChange={(e) => {
                                        this.validatePassword(e);
                                        this.handleChange(e);

                                    }}
                                    onBlur={(e) => {
                                        // this.validatePassword(e);
                                        this.handleChange(e)
                                    }}
                                />
                                {(() => {
                                    if (this.state.validate.password === "has-danger") {
                                        return <FormFeedback>Required</FormFeedback>;
                                    } else {
                                        return <FormFeedback>Spaces Not Allowed</FormFeedback>;
                                    }
                                })()}
                            </FormGroup>

                            <button type="Submit" value="submit" className="confirm-button btn btn-success pull-right" disabled={loginDisabled} >Login</button>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }

    render() {

        return (
            <>
                {this.renderLoginForm()}
            </>
        );
    }
}
export default withRouter(connect(mapStateToProps)(LoginPage));
