import React, { Component } from 'react';
import { Row } from 'reactstrap';
import { Link } from "react-router-dom";
import { Card, CardImg, CardTitle } from 'reactstrap';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Label, Col } from 'reactstrap';
import { LocalForm, Control, Errors } from 'react-redux-form'
import { withRouter } from 'react-router-dom';
import { connect, useSelector, useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { get_recipe, get_recipe_reset } from "../redux/ActionCreators";

import Loading from "./LoadingComponent";
import { baseUrl } from '../shared/baseUrl';

import Alert from '@material-ui/lab/Alert';
import Image from "material-ui-image";

const mapStateToProps = state => {
    return {
        curr_recipe: state.curr_recipe
    }
}

const mapDispatchToProps = (dispatch) => ({
    get_recipe: (rec_id) => dispatch(get_recipe(rec_id)),
    get_recipe_reset: () => dispatch(get_recipe_reset())
});

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

const RenderIngredients = ({ rec_ingredients }) => {
    if (rec_ingredients.length <= 0) {
        return (null);
    }

    const mapIngredientToList = (ingredient) => {
        return (
            <li>
                {`${ingredient.ingred_name} ${ingredient.ingred_quantity}${ingredient.ingred_unit}`}
            </li>
        )
    }

    //console.log(JSON.stringify(rec_ingredients))
    const ingredients = rec_ingredients.map(mapIngredientToList)

    return (
        <div className="recipe-details-ingredient-box">

            <div className="recipe-details-ingredient-title">
                <h4 style={{ verticalAlign: "middle", margin: "0" }}>Ingredients</h4>
            </div>
            <div className="recipe-details-ingredient">
                <ol>
                    {ingredients}
                </ol>
            </div>


        </div>

    );
}

const RenderTitle = ({ rec_id, rec_name, rec_img }) => {
    const recipeTiles = (
        <div key={rec_id} className="recipe-details-title">
            <div className="row">
                <div className="col-6" style={{ paddingRight: "5px" }} >
                    <Image src={rec_img} alt={rec_name} aspectRatio={(1 / 1)} />
                </div>

                <div className="col-6" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", paddingLeft: "0px" }}>
                    <div>
                        <h3 style={{ verticalAlign: "middle", margin: "0" }}>{rec_name}</h3>
                    </div>

                </div>
            </div>

        </div>
    )

    return recipeTiles;
}

const RenderInformation = ({ cooking_time, serving_pax, cuisine, rec_type, isPublished }) => {
    return (
        <div className="container" className="recipe-details-info">

            <div className="row">
                <div className="col-6">
                    <div style={{ fontSize: "16px" }}>
                        <strong>Cooking Time</strong>
                    </div>
                    <div>
                        <FontAwesomeIcon icon="clock" />
                        &nbsp; {cooking_time} mins
                    </div>
                </div>

                <div className="col-6">

                    <div >
                        <div style={{ fontSize: "16px" }}>
                            <strong>Serving Size</strong>
                        </div>
                        <FontAwesomeIcon icon="user" />
                        &nbsp; {serving_pax} pax
                    </div>
                </div>
            </div>

            <div className="row box-information">
                <div className="col-6">
                    <div style={{ fontSize: "16px", textTransform: "capitalize" }}>
                        <strong>Cuisine</strong>
                    </div>
                    {toTitleCase(cuisine)}
                </div>

                <div className="col-6">
                    <div style={{ fontSize: "16px" }}>
                        <strong>Recipe Type</strong>
                    </div>
                    {toTitleCase(rec_type)}
                </div>
            </div>

            <div className="row box-information">
                <div className="col-12">
                    <div style={{ fontSize: "16px" }}>
                        <strong>Privacy Setting</strong>
                    </div>
                    {(isPublished) ?
                        <><FontAwesomeIcon icon="lock-open" />&nbsp; Public</> :
                        <><FontAwesomeIcon icon="lock" />&nbsp; Private</>}
                </div>

            </div>

        </div>
    )
}

const RenderSteps = ({ rec_steps }) => {

    const steps = rec_steps
    return (
        <div className="recipe-details-steps" >
            <p style={{ "white-space": "pre-line" }}>
                {steps}
            </p>
        </div>
    )
}



class RecipeDetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipe: this.props.curr_recipe,
        }
    }

    componentDidMount() {
        if (this.props.curr_recipe.inProgress === "idle") {
            //console.log(JSON.stringify(this.props.rec_id))
            //console.log("Getting data now!")
            this.props.get_recipe(this.props.rec_id)
        }

    }


    componentWillUnmount() {
        if (this.props.curr_recipe.inProgress === "success") {
            this.props.get_recipe_reset();
        }

    }

    render() {
        if (this.props.curr_recipe.inProgress !== "success") {
            return (
                <Loading />
            );
        } else {
            return (
                <div className="container-fluid">

                    {(() => {
                        if (this.props.curr_recipe.inProgress === "failed") {
                            return (
                                <Alert severity="error">{this.props.curr_recipe.errMess}</Alert>
                            )

                        } else if (this.props.curr_recipe.inProgress === "inProgress") {
                            return (
                                <>
                                    <Alert severity="info">Hold on...Serving up the recipe soon!</Alert>
                                    <Loading />
                                </>
                            )
                        }
                    })()}


                    <div className="row">
                        <div className="col-12 col-md-6 recipe-details-left-box">
                            <div className="recipe-details-info-title">
                                <h4 style={{ verticalAlign: "middle", margin: "0" }}>Title</h4>
                            </div>

                            <RenderTitle rec_id={this.props.rec_id} rec_name={this.props.curr_recipe.recipe.rec_name} rec_img={baseUrl + this.props.curr_recipe.recipe.url} />

                        </div>

                        <div className="col-12 col-md-6 recipe-details-info-box">
                            <div>
                                <div className="recipe-details-info-title">
                                    <h4 style={{ verticalAlign: "middle", margin: "0" }}>Information</h4>
                                </div>
                                <RenderInformation cooking_time={this.props.curr_recipe.recipe.cooking_time} serving_pax={this.props.curr_recipe.recipe.serving_pax}
                                    cuisine={this.props.curr_recipe.recipe.cuisine} rec_type={this.props.curr_recipe.recipe.rec_type} isPublished={this.props.curr_recipe.recipe.isPublished}
                                />

                            </div>
                        </div>


                    </div>

                    <div className="row">
                        <div className="col-12 col-md-6 recipe-details-left-box">
                            <RenderIngredients rec_ingredients={this.props.curr_recipe.recipe.ingredient} />
                        </div>

                        <div className="col-12 col-md-6 recipe-details-steps-box">
                            <div>
                                <div className="recipe-details-steps-title">
                                    <h4 style={{ verticalAlign: "middle", margin: "0" }}>Recipe</h4>
                                </div>
                                <RenderSteps rec_steps={this.props.curr_recipe.recipe.rec_instructions} />
                            </div>
                        </div>

                    </div>
                </div>
            )
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecipeDetailsPage));
// export default RecipeDetailsPage;