import React, { Component } from 'react';
import { Col, Row, Navbar, NavbarBrand, Button, Form, FormGroup, FormFeedback, FormText, Label, Input } from 'reactstrap';
// import  {Form} from "react-bootstrap";
import { LocalForm, Control, Errors } from "react-redux-form";
import { Redirect } from 'react-router';

import Alert from '@material-ui/lab/Alert';
import Image from "material-ui-image";

import { baseUrl } from '../shared/baseUrl';
import { load_profile_image, load_profile_image_reset, update_profile_image, login_edit_attempt, login_edit_reset } from "../redux/ActionCreators";
import Loading from "./LoadingComponent";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";

const mapStateToProps = state => {
    return {
        login: state.login,
        images: state.images,
    }
}

const mapDispatchToProps = (dispatch) => ({
    load_profile_image: (recipeId) => dispatch(load_profile_image(recipeId)),
    load_profile_image_reset: () => dispatch(load_profile_image_reset()),
    update_profile_image: (recipeId, image) => dispatch(update_profile_image(recipeId, image)),
    login_edit_attempt: (userId, first_name, last_name, email, username, password) => dispatch(login_edit_attempt(userId, first_name, last_name, email, username, password)),
    login_edit_reset: () => dispatch(login_edit_reset())
});

const minLength = (len) => (value) => value && (value.length >= len);
const maxLength = (len) => (value) => !(value) || (value.length <= len);
const required = value => value && (value.length);
const email_re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


function getCurrentDate(separator = '') {

    var newDate = new Date()
    var date = newDate.getDate();
    var month = newDate.getMonth() + 1;
    var year = newDate.getFullYear();
    var h = newDate.getHours();
    var m = newDate.getMinutes();
    var s = newDate.getSeconds();

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}${separator}${h}${separator}${m}${separator}${s}`
}

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: this.props.login.user.first_name,
            last_name: this.props.login.user.last_name,
            email: this.props.login.user.email,
            username: this.props.login.user.username,
            password: "",
            confirm_password: "",
            image: "",
            change: getCurrentDate()
            , validate: {
                first_name: "has-success",
                last_name: "has-success",
                email: "has-success",
                username: "",
                password: "idle",
                confirm_password: "idle"
            }
            , isLoading: false
        }
        this.handleSignup = this.handleSignup.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {

        if (this.props.images.profile.inProgress === "idle" || this.props.images.profile.inProgress === "failed") {
            // alert("Getting recipe image")
            this.props.load_profile_image(this.props.login.user.id);
        }
    }

    componentWillUnmount() {
        if (this.props.login.inProgress !== "login_success") {
            this.props.login_edit_reset();
        }
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
        if (value.length === 0) {
            result = "has-danger";
        } else if (!no_whitespace.test(value)) {
            result = "white-space"
        } else {
            result = "inProgress"
        }

        this.setState({
            [name]: value,
            validate: { ...this.state.validate, [name]: result }
        });
    }


    validateName(event) {
        const { target } = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const { name } = target;
        const no_whitespace = /^\S+$/
        const result = (value.length > 0 && no_whitespace.test(value));
        if (result) {
            this.setState({ validate: { ...this.state.validate, [name]: "has-success" } });
        } else if (value.length === 0) {
            this.setState({ validate: { ...this.state.validate, [name]: "has-danger" } });
        } else {
            this.setState({ validate: { ...this.state.validate, [name]: "white-space" } });
        }
    }

    validateEmail(event) {
        const { target } = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const { name } = target;
        const no_whitespace = /^\S+$/
        const email_re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const result = (value.length > 0 && email_re.test(value) && no_whitespace.test(value));
        if (result) {
            this.setState({ validate: { ...this.state.validate, [name]: "has-success" } });
        } else if (value.length === 0) {
            this.setState({ validate: { ...this.state.validate, [name]: "has-danger" } });
        } else if (!email_re.test(value)) {
            this.setState({ validate: { ...this.state.validate, [name]: "invalid-email" } });
        } else {
            this.setState({ validate: { ...this.state.validate, [name]: "white-space" } });
        }
    }

    validateUsername(event) {
        const { target } = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const { name } = target;
        const no_whitespace = /^\S+$/;

        const result = (no_whitespace.test(value) && value.length > 0);
        if (value.length === 0) {
            this.setState({ validate: { ...this.state.validate, [name]: "has-danger" } });
        } else if (!no_whitespace.test(value)) {
            this.setState({ validate: { ...this.state.validate, [name]: "white-space" } });
        } else {
            this.setState({ validate: { ...this.state.validate, [name]: "checking" } });
            fetch(baseUrl + "user/checkuser/", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "username": value
                })
            }).then(resp => resp.json())
                .then(resp => {
                    if (resp.status === "Does not exist") {
                        this.setState({ validate: { ...this.state.validate, [name]: "has-success" } });
                        return resp;
                    } else {
                        this.setState({ validate: { ...this.state.validate, [name]: "username-taken" } });
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

    validatePassword(event) {
        const { target } = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const { name } = target;
        const no_whitespace = /^\S+$/;
        const result = (no_whitespace.test(value) && value.length > 0);
        // alert(JSON.stringify(no_whitespace.test(value)));


        var confirmPassword = this.state.confirm_password;

        if (value.length === 0) {
            this.setState({ confirm_password: "", validate: { ...this.state.validate, password: "idle", confirm_password: "idle" } });
        } else if (!no_whitespace.test(value)) {
            //console.log("here");
            this.setState({ validate: { ...this.state.validate, password: "white-space" } });
        } else if (confirmPassword !== value) {
            //console.log(this.state.confirm_password);
            //console.log(value);
            //console.log(this.state.confirm_password !== value);
            this.setState({ validate: { ...this.state.validate, password: "has-success", confirm_password: "password-mismatch" } });
        } else {
            this.setState({ validate: { ...this.state.validate, password: "has-success", confirm_password: "has-success" } });
        }
    }

    validateConfirmPassword(event) {
        const value = this.state.confirm_password;

        const { target } = event;
        const newValue = target.type === "checkbox" ? target.checked : target.value;
        const { name } = target;

        const no_whitespace = /^\S+$/;
        const result = (no_whitespace.test(value) && value.length > 0);

        if (value.length === 0) {
            this.setState({ validate: { ...this.state.validate, confirm_password: "has-danger" } });
        } else if (!no_whitespace.test(value)) {
            this.setState({ validate: { ...this.state.validate, confirm_password: "white-space" } });
        } else if (newValue !== value) {
            this.setState({ validate: { ...this.state.validate, confirm_password: "password-mismatch" } });
        } else {
            this.setState({ validate: { ...this.state.validate, confirm_password: "has-success" } });
        }
    }

    validateConfirmPasswordOnChange(event) {
        const { target } = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const { name } = target;
        const no_whitespace = /^\S+$/;
        const result = (no_whitespace.test(value) && value.length > 0);

        if (this.state.confirm_password === "") {
            this.setState({ validate: { ...this.state.validate, confirm_password: "has-danger" } });
        } else if (this.state.confirm_password !== value) {
            this.setState({ validate: { ...this.state.validate, confirm_password: "password-mismatch" } });
        } else {
            this.setState({ validate: { ...this.state.validate, confirm_password: "has-success" } });
        }
    }

    validateNewConfirmPassword(event) {
        const { target } = event;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const { name } = target;
        const no_whitespace = /^\S+$/;
        const result = (no_whitespace.test(value) && value.length > 0);

        if (value.length === 0) {
            this.setState({ validate: { ...this.state.validate, confirm_password: "has-danger" } });
        } else if (!no_whitespace.test(value)) {
            this.setState({ validate: { ...this.state.validate, confirm_password: "white-space" } });
        } else if (this.state.password !== value) {
            this.setState({ validate: { ...this.state.validate, confirm_password: "password-mismatch" } });
        } else {
            this.setState({ validate: { ...this.state.validate, confirm_password: "has-success" } });
        }
    }


    handleSignup(event) {
        event.preventDefault();

        // alert(this.state.password === "");
        // alert(this.props.login.user.password);

        //console.log(this.state.password)

        if (this.state.password !== "" && this.state.validate.password === "has-success" && this.state.validate.confirm_password === "has-success") {
            this.props.login_edit_attempt(this.props.login.user.id, this.state.first_name, this.state.last_name, this.state.email, this.state.username,
                this.state.password);
        } else {
            this.props.login_edit_attempt(this.props.login.user.id, this.state.first_name, this.state.last_name, this.state.email, this.state.username);
        }

    }

    validate() {
        const email_re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const has_whitespace = /\s/;
        const validation = {
            first_name: (this.state.first_name !== "" && this.state.first_name.length > 0) ? true : false,
            last_name: (this.state.last_name !== "" && this.state.last_name.length > 0) ? true : false,
            email: (this.state.email !== "" && this.state.email.length > 0 && email_re.test(this.state.email)) ? true : false,
            username: (this.state.username !== "" && this.state.username),
            password: true
        }
        return validation;
    }

    renderSignupForm() {
        //console.log(JSON.stringify(this.state))

        // const validation = this.validate();
        // console.log(JSON.stringify(validation))

        const canSubmit = (this.state.validate.first_name === "has-success" && this.state.validate.last_name === "has-success" &&
            this.state.validate.email === "has-success" && (this.state.validate.password === "has-success" || this.state.validate.password === "idle") &&
            (this.state.validate.confirm_password === "has-success" || this.state.validate.confirm_password === "idle"));

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
                                    this.handleChange(e)
                                }
                                }
                                value={this.state.first_name}
                                onBlur={(e) => {
                                    this.validateName(e);
                                    this.handleChange(e)
                                }}
                            />
                            {(() => {
                                if (this.state.validate.first_name === "has-danger") {
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
                                    this.handleChange(e)
                                }
                                }
                                value={this.state.last_name}
                                onBlur={(e) => {
                                    this.validateName(e);
                                    this.handleChange(e)
                                }}
                            />
                            {(() => {
                                if (this.state.validate.last_name === "has-danger") {
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
                            this.handleChange(e)
                        }
                        }
                        value={this.state.email}
                        onBlur={(e) => {
                            this.validateEmail(e);
                            this.handleChange(e)
                        }}
                    />
                    {(() => {
                        if (this.state.validate.email === "has-danger") {
                            return <FormFeedback>Required</FormFeedback>;
                        } else if (this.state.validate.email === "invalid-email") {
                            return <FormFeedback>Invalid Email Format</FormFeedback>;
                        } else {
                            return <FormFeedback>Spaces Not Allowed</FormFeedback>;
                        }
                    })()}
                </FormGroup>

                {/* <FormGroup>
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
                            this.handleChange(e)
                        }}
                    />
                    {(() => {
                        if (this.state.validate.username === "has-danger") {
                            return <FormFeedback>Required</FormFeedback>;
                        } else if (this.state.validate.username === "username-taken") {
                            return <FormFeedback>Username Already In Use</FormFeedback>;
                        } else if (this.state.validate.username === "white-space") {
                            return <FormFeedback>Spaces Not Allowed</FormFeedback>;
                        } else {
                            return <FormFeedback>Hold On... Checking if Username is in use</FormFeedback>;
                        }
                    })()}
                </FormGroup> */}

                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" id="password" placeholder=""
                        valid={this.state.validate.password === "has-success"}
                        invalid={this.state.validate.password === "has-danger" || this.state.validate.password === "white-space"}
                        onChange={(e) => {
                            // console.log(e.target.value);
                            this.validatePassword(e);
                            this.handleChange(e);
                            // this.validateConfirmPassword(e);
                            // this.handlePasswordChange(e);
                            // this.validateConfirmPasswordOnChange(e);
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
                        if (this.state.validate.confirm_password === "has-danger") {
                            return <FormFeedback>Required</FormFeedback>;
                        } else if (this.state.validate.confirm_password === "white-space") {
                            return <FormFeedback>Spaces Not Allowed</FormFeedback>;
                        } else if (this.state.validate.confirm_password === "password-mismatch") {
                            return <FormFeedback>Password Do Not Match</FormFeedback>;
                        }
                    })()}
                </FormGroup>

                <button type="submit" className="signup-button btn btn-primary pull-right" disabled={!canSubmit}>Update</button>
            </Form>
        )
    }

    getCurrentDate(separator = '') {

        var newDate = new Date()
        var date = newDate.getDate();
        var month = newDate.getMonth() + 1;
        var year = newDate.getFullYear();
        var h = newDate.getHours();
        var m = newDate.getMinutes();
        var s = newDate.getSeconds();

        return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}${separator}${h}${separator}${m}${separator}${s}`
    }

    changeImage(event) {
        event.preventDefault();
        this.setState({ image: event.target.files[0] });
    }

    uploadImage(event) {
        event.preventDefault();
        // alert("Uploading Image");

        var newImage = this.state.image;



        this.props.load_profile_image_reset();

        this.props.update_profile_image(this.props.login.user.id, newImage).then(() => this.setState({ "image": null, "change": this.getCurrentDate() }));

    }

    renderProfileImage() {

        return (
            <div className="row">

                <div className="col-6" style={{ paddingRight: "5px" }} >

                    <Image  src={(this.props.images.profile.inProgress === "success") ? `${baseUrl}${this.props.images.profile.url}?${this.state.change}` : ""}
                        aspectRatio={(1 / 1)} />
                </div>

                <div className="col-6" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", paddingLeft: "0px" }}>
                    <FormGroup>
                        <Input id="recipe-image-upload" type="file" className="" onChange={event => this.changeImage(event)}
                            onClick={e => (e.target.value = null)}
                        />
                        <button type=" " className="upload-button btn btn-primary"
                            onClick={(event) => this.uploadImage(event)}
                        ><FontAwesomeIcon icon="upload" />&nbsp; Upload</button>
                    </FormGroup>
                </div>
            </div>
        )
    }

    render() {

        if (this.props.login.inProgress === "update_success") {
            return (<Redirect to="/explore" />)
        }
        return (
            <div className="signup-bg">
                <div className="signup-form">
                    <div className="container">
                        <h2>Update Information</h2>
                        <p>Feel free to update your information here!</p>
                        <hr />
                        {(() => {
                            if (this.props.login.inProgress === "update_success") {
                                return (
                                    <Alert severity="info" style={{ marginBottom: "10px" }}>
                                        Successfully updated your info!
                                    </Alert>
                                )

                            } else if (this.props.login.inProgress === "update_inProgress") {
                                return (
                                    <>
                                        <Alert severity="info" style={{ marginBottom: "10px" }}>Hold on...Updating your info soon!</Alert>
                                        <Loading />
                                    </>
                                )
                            } else if (this.props.login.inProgress === "update_failed") {
                                return (
                                    <Alert severity="error" style={{ marginBottom: "10px" }}>{this.props.login.errMess}</Alert>
                                )
                            }
                        })()}
                        {this.renderProfileImage()}
                        {this.renderSignupForm()}
                    </div>
                </div>

            </div>

        );
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountPage));
