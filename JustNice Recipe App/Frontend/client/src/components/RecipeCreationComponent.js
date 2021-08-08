import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { Card, CardImg, CardTitle } from 'reactstrap';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import {
    Col, Row, Navbar, NavbarBrand, Button, Form, FormGroup, FormFeedback, FormText, Label,
    InputGroup, InputGroupAddon, InputGroupText, Input
} from 'reactstrap';
import { LocalForm, Control, Errors } from 'react-redux-form'
import { withRouter } from 'react-router';
import { connect } from "react-redux";

import {
    get_recipe, get_recipe_reset, update_recipe, load_recipe_image,
    update_recipe_image, load_recipe_image_reset, load_recipe_image_success
} from '../redux/ActionCreators';

import Alert from '@material-ui/lab/Alert';
import Image from "material-ui-image";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { FormHelperText } from '@material-ui/core';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import RecipeIngredients from "./RecipeCreationgIngredientComponent";
import Loading from "./LoadingComponent";
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => {
    return {
        login: state.login,
        curr_recipe: state.curr_recipe,
        images: state.images,

    }
}

const mapDispatchToProps = (dispatch) => ({
    get_recipe: (rec_id) => dispatch(get_recipe(rec_id)),
    update_recipe: (recipe, user_id) => dispatch(update_recipe(recipe, user_id)),
    get_recipe_reset: () => dispatch(get_recipe_reset()),
    load_recipe_image: (recipeId) => dispatch(load_recipe_image(recipeId)),
    update_recipe_image: (recipeId, image) => dispatch(update_recipe_image(recipeId, image)),
    load_recipe_image_reset: () => dispatch(load_recipe_image_reset()),
    load_recipe_image_success: (details) => dispatch(load_recipe_image_success(details)),
});

function getCurrentDateFunc(separator = '') {

    var newDate = new Date()
    var date = newDate.getDate();
    var month = newDate.getMonth() + 1;
    var year = newDate.getFullYear();
    var h = newDate.getHours();
    var m = newDate.getMinutes();
    var s = newDate.getSeconds();

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}${separator}${h}${separator}${m}${separator}${s}`
}

class RecipeCreationPage extends Component {
    constructor(props) {
        super(props);
        //console.log(getCurrentDateFunc());
        if (this.props.rec_id !== "new" && this.props.curr_recipe.recipe !== null && (this.props.curr_recipe.inProgress === "success" || this.props.curr_recipe.inProgress === "updating" ||
            this.props.curr_recipe.inProgress === "update_failed")) {
            this.state = {
                "rec_id": this.props.curr_recipe.recipe.rec_id,
                "rec_name": this.props.curr_recipe.recipe.rec_name,
                "rec_instructions": this.props.curr_recipe.recipe.rec_instructions,
                "cooking_time": this.props.curr_recipe.recipe.cooking_time,
                "serving_pax": this.props.curr_recipe.recipe.serving_pax,
                "cuisine": this.props.curr_recipe.recipe.cuisine,
                "rec_type": this.props.curr_recipe.recipe.rec_type,
                "isPublished": this.props.curr_recipe.recipe.isPublished,
                "ingredient": this.props.curr_recipe.recipe.ingredient.map(ingredient => ({
                    ...ingredient, "isValid": "valid"
                })),
                "image": null,
                "change": getCurrentDateFunc(),
            }
        } else {
            this.state = {
                "rec_id": "new",
                "rec_name": "",
                "rec_instructions": "",
                "cooking_time": 60,
                "serving_pax": 1,
                "cuisine": "Chinese",
                "rec_type": "Breakfast",
                "isPublished": false,
                "ingredient": []
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.trackContent = this.trackContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleIngredient = this.handleIngredient.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    componentDidMount() {

        if (this.props.rec_id !== "new" && this.props.curr_recipe.inProgress === "idle") {
            // alert(JSON.stringify([this.props.rec_id, this.props.curr_recipe.inProgress]))
            this.props.get_recipe(this.props.rec_id);
        }

        if ((this.props.images.recipe.inProgress === "idle" || this.props.images.recipe.inProgress === "default") && this.props.location.pathname !== "/newrecipe") {
            // alert("Getting recipe image")
            this.props.load_recipe_image(this.props.rec_id);
        }     

        if (this.rec_instructions) {
            this.trackContent(this.rec_instructions)
        }
        if (this.rec_name) {
            this.trackContent(this.rec_name)
        }
    }

    handleIngredient(newIngredients) {
        this.setState({
            "ingredient": newIngredients
        })
    }

    componentWillUnmount() {
        if (this.props.curr_recipe.inProgress === "update_success") {
            this.props.get_recipe_reset()
            this.props.load_recipe_image_reset()
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

    handleIntegerChange(event) {
        const { target } = event;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        value = Math.floor(value);

        this.setState({
            [name]: value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        var final = Object.assign({}, this.state);
        delete final.image;
        this.props.update_recipe(final, this.props.login.user.id);
    }

    changeImage(event) {
        event.preventDefault();
        this.setState({ image: event.target.files[0] });
    }

    uploadImage(event) {
        event.preventDefault();
        // alert("Uploading Image");

        if (this.state.image !== null) {
            var newImage = this.state.image;

            // this.setState({ "image": null, change: !this.state.change });

            this.props.load_recipe_image_reset();

            this.props.update_recipe_image(this.props.rec_id, newImage).then(() => this.setState({ "image": null, change: this.getCurrentDate() }));
        }
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

    renderTitle() {
        const recipeTiles = (
            <div key={this.state.rec_id} className="recipe-details-title">
                <div className="row">

                    <div className="col-6" style={{ paddingRight: "5px" }} >
                        <Image src={(this.props.images.recipe.inProgress === "success" || this.props.images.recipe.inProgress === "default") ? 
                        `${baseUrl}${this.props.images.recipe.url}?${this.state.change}` : 
                        ""}
                            aspectRatio={(1 / 1)} />
                    </div>



                    <div className="col-6" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", paddingLeft: "0px" }}>
                    
                        <FormGroup className="recipe-creation-name-box">
                            <textarea name="rec_name" placeholder="Recipe Name" className="form-control recipe-creation-name"
                                value={this.state.rec_name}
                                ref={el => this.rec_name = el}
                                onChange={e => {
                                    this.trackContent(this.rec_name)
                                    this.handleChange(e)
                                }}
                            />
                        </FormGroup>

                        {(() => {
                            if (this.state.rec_id === "new") {

                            } else {
                                return (
                                    <form id="uploadImage" onSubmit={event => alert("image being submitted")} action="#" method="put">
                                    <FormGroup>
                                        <Input id="recipe-image-upload" type="file" className="" onChange={e => this.changeImage(e)} form="uploadImage"
                                            onClick={e => (e.target.value = null)}
                                        />
                                        <button type="button" className="upload-button btn btn-primary"
                                            onClick={(event) => this.uploadImage(event)}>
                                            <FontAwesomeIcon icon="upload" />&nbsp; Upload
                                        </button>
                                    </FormGroup>
                                    </form>
                                )
                            }
                        })()}


                    </div>
                </div>

            </div >
        )

        return recipeTiles;
    }


    renderInformation() {
        return (
            <div className="container" className="recipe-details-info">

                <div className="row">
                    <div className="col-6">
                        <FormGroup>
                            <Label style={{ fontSize: "16px" }} for="cooking_time"><strong>Cooking Time</strong></Label>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText><FontAwesomeIcon icon="clock" /></InputGroupText>
                                </InputGroupAddon>
                                <Input placeholder="mins" min={1} max={999} type="number"
                                    name="cooking_time" value={this.state.cooking_time}
                                    onChange={e => this.handleIntegerChange(e)}
                                />
                            </InputGroup>
                        </FormGroup>

                    </div>

                    <div className="col-6">
                        <FormGroup>
                            <Label style={{ fontSize: "16px" }} for="serving_pax"><strong>Serving Pax</strong></Label>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText><FontAwesomeIcon icon="user" /></InputGroupText>
                                </InputGroupAddon>
                                <Input placeholder="Pax" min={1} max={999} type="number"
                                    name="serving_pax" value={this.state.serving_pax}
                                    onChange={e => this.handleIntegerChange(e)}
                                />
                            </InputGroup>
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <FormGroup>
                            <Label style={{ fontSize: "16px" }} for="cuisine"><strong>Cuisine</strong></Label>
                            <Input type="select" name="cuisine" value={this.state.cuisine}
                                onChange={e => this.handleChange(e)}>

                                <option value="Chinese">Chinese</option>
                                <option value="Western">Western</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Korean">Korean</option>
                                <option value="Indian">Indian</option>
                                <option value="Thai">Thai</option>
                                <option value="Mexican">Mexican</option>
                                <option value="Others">Others</option>
                            </Input>
                        </FormGroup>
                    </div>

                    <div className="col-6">
                        <FormGroup>
                            <Label style={{ fontSize: "16px" }} for="cuisine"><strong>Recipe Type</strong></Label>
                            <Input type="select" name="rec_type" value={this.state.rec_type}
                                onChange={e => this.handleChange(e)}>

                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Brunch">Brunch</option>
                                <option value="Snack">Snack</option>
                            </Input>
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div style={{ fontSize: "16px" }} for="isPublished"><strong>Privacy Setting</strong></div>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.isPublished}
                                    onChange={e => this.handleChange(e)}
                                    name="isPublished"
                                    color="primary"
                                />
                            }
                            label={this.state.isPublished ?
                                <><FontAwesomeIcon icon="lock-open" />&nbsp; Public</> :
                                <><FontAwesomeIcon icon="lock" />&nbsp; Private</>}
                        />
                        <FormHelperText style={{ fontSize: "11px" }} id="component-helper-text">Note: Public recipes means that other users can view them.</FormHelperText>
                    </div>
                </div>

            </div>
        )
    }


    trackContent(element) {
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    }

    renderSteps() {
        return (
            <FormGroup >
                <div className="recipe-details-steps">
                    <textarea name="rec_instructions" placeholder="Steps" className="form-control"
                        // rows={rows}
                        ref={el => { this.rec_instructions = el }}
                        value={this.state.rec_instructions}
                        onChange={e => {
                            this.trackContent(this.rec_instructions)
                            this.handleChange(e)
                        }}
                        style={{minHeight: "180px"}}
                        
                    ></textarea>
                </div>
            </FormGroup>
        )
    }

    isNumeric(value) {
        return /^\d+$/.test(value);
    }

    isEmpty(value) {
        const no_whitespace = /^\S+$/;
        return (value === "" || !no_whitespace.test(value));
    }

    isDisabled() {
        var test = this.state.ingredient.some(ingredient => ingredient.isValid === "required" || ingredient.isValid === "init" || !this.isNumeric(ingredient.ingred_quantity) ||
            this.isEmpty(ingredient.ingred_quantity));

        // We will not allow recipes without ingredients
        if(this.state.ingredient.length === 0) {
            test = true;
        }

        test = test || this.state.rec_name === "";
        test = test || this.state.rec_instructions === "";
        //console.log(test);
        return test;
    }

    render() {
        // return (
        //     <Loading />
        // );

        //console.log(JSON.stringify(this.state))
        //console.log(JSON.stringify(this.props.images.recipe.url))
        //console.log(JSON.stringify(this.state.image))

        if (this.props.curr_recipe.inProgress === "loading") {
            return (
                <Loading />
            )

        } else if (this.props.curr_recipe.inProgress === "update_success") {
            return (<Redirect to="/myrecipes" />)
        } else {
            return (
                <Form className="edit-form" onSubmit={event => this.handleSubmit(event)}>
                    {(() => {
                        if (this.props.curr_recipe.inProgress === "update_failed") {
                            return <Alert severity="error">{this.props.curr_recipe.errMess}</Alert>;
                        } else if (this.props.curr_recipe.inProgress === "update_failed") {
                            return <Alert severity="success">Recipe updated successfully!</Alert>;
                        }
                    })()}

                    <div className="container-fluid">

                        <div className="row">
                            <div className="col-12 col-md-6 recipe-details-left-box">
                                <div className="recipe-details-info-title">
                                    <h4 style={{ verticalAlign: "middle", margin: "0" }}>Title</h4>
                                </div>
                                {this.renderTitle()}
                            </div>

                            <div className="col-12 col-md-6 recipe-details-info-box">
                                <div>
                                    <div className="recipe-details-info-title">
                                        <h4 style={{ verticalAlign: "middle", margin: "0" }}>Information</h4>
                                    </div>
                                    {this.renderInformation()}

                                </div>
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-12 col-md-6 recipe-details-left-box">
                                <RecipeIngredients ingredients={this.state.ingredient}
                                    handleIngredient={this.handleIngredient}
                                />
                            </div>

                            <div className="col-12 col-md-6 recipe-details-steps-box">
                                <div>
                                    <div className="recipe-details-steps-title">
                                        <h4 style={{ verticalAlign: "middle", margin: "0" }}>Recipe</h4>
                                    </div>
                                    {this.renderSteps()}

                                </div>
                            </div>
                        </div>

                        <div className="row" style={{ position: "relative", width: "100%", height: "100px" }}>
                            <div className="confirm-cancel-button">

                                <Link to="/myrecipes">
                                    <button type="button" className="cancel-button btn btn-danger"><FontAwesomeIcon icon="times" />&nbsp; Cancel</button>
                                </Link>

                                <button type="submit" className="confirm-button btn btn-success"
                                    disabled={this.isDisabled()}
                                ><FontAwesomeIcon icon="check" />&nbsp; Confirm</button>

                            </div>

                        </div>
                    </div>
                </Form>
            )
        }

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecipeCreationPage));