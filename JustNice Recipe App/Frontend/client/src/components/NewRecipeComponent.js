import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import {Card, CardImg, CardTitle} from 'reactstrap';
import { Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import { Col, Row, Navbar, NavbarBrand, Button, Form, FormGroup, FormFeedback, FormText, Label, Input } from 'reactstrap';
import {LocalForm, Control, Errors} from 'react-redux-form'
import { withRouter } from 'react-router';
import { connect } from "react-redux";

import Alert from '@material-ui/lab/Alert';

import { get_recipe, get_recipe_success, get_recipe_reset, update_recipe } from '../redux/ActionCreators';

import RecipeIngredients from "./RecipeCreationgIngredientComponent";
import Loading from "./LoadingComponent";

const mapStateToProps = state => {
    return {
        login: state.login,
        curr_recipe: state.curr_recipe
    }
  }
  
const mapDispatchToProps = (dispatch) => ({
    get_recipe: (rec_id) => dispatch(get_recipe(rec_id)),
    update_recipe: (recipe, user_id) => dispatch(update_recipe(recipe, user_id)),
    get_recipe_reset: () => dispatch(get_recipe_reset()),
    get_recipe_success: (recipe) => dispatch(get_recipe_success(recipe)),
});


class NewRecipePage extends Component {
    constructor(props) {
        super(props);
        this.state= {
            "rec_id": "new",
            "rec_name": "",
            "rec_instructions": "",
            "cooking_time": 60,
            "serving_pax": 1,
            "cuisine": "global",
            "rec_type": "edible",
            "isPublished": true,
            "ingredient": []
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.trackContent = this.trackContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleIngredient = this.handleIngredient.bind(this);
    }

    componentDidMount() {

        if (this.props.curr_recipe.inProgress === "idle") {
            this.props.get_recipe_success(this.state);
        }

        // if (this.rec_instructions) {
        //     this.trackContent(this.rec_instructions)
        // }
        // if (this.rec_name) {
        //     this.trackContent(this.rec_name)
        // }
    }

    handleIngredient(newIngredients) {
        this.setState({
            "ingredient": newIngredients
        })
    }

    componentWillUnmount() {
        if (this.props.curr_recipe.inProgress === "success" || this.props.curr_recipe.inProgress === "update_success") {
            this.props.get_recipe_reset()
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

    handleSubmit(event) {
        event.preventDefault();
        this.props.update_recipe(this.state, this.props.login.user.id);
    }

    renderTitle() {
        const recipeTiles = (
                <div key={this.state.rec_id} className="recipe-details-title">
                    <div className="row">
                        <img className="recipe-tile-img col-6" src={this.state.img} alt={this.state.rec_name} style={{paddingRight:"5px"}}/>
                        <div className="col-6" style={{display:"flex",alignItems:"center", flexWrap:"wrap", paddingLeft:"0px"}}>
                            <FormGroup className="recipe-creation-name-box">
                                <textarea name="rec_name" placeholder="Recipe Name" className="form-control recipe-creation-name"
                                    value={this.state.rec_name}
                                    ref={el => this.rec_name = el}
                                    onChange={e => {
                                        this.trackContent(this.rec_name)
                                        this.handleChange(e)}}
                                />
                            </FormGroup>
                            
                        </div>
                    </div>
                    
                </div>
        )
        
        return recipeTiles;
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
                        ref={el => {this.rec_instructions = el}}
                        value={this.state.rec_instructions}
                        onChange={e => {
                            this.trackContent(this.rec_instructions)
                            this.handleChange(e)}}
                    ></textarea>
                </div>
            </FormGroup>
        )   
    }

    isNumeric(value) {
        return /^\d+$/.test(value);
    }

    isEmpty(value){
        const no_whitespace = /^\S+$/;
        return (value === "" || !no_whitespace.test(value)); 
    }

    isDisabled() {
        var list = this.state.ingredient.filter(ingredient => ingredient.isValid === "required" || !this.isNumeric(ingredient.ingred_quantity) ||
        this.isEmpty(ingredient.ingred_quantity));

        console.log(JSON.stringify(list));

        var test = this.state.ingredient.some(ingredient => ingredient.isValid === "required" || ingredient.isValid === "init" || !this.isNumeric(ingredient.ingred_quantity) ||
        this.isEmpty(ingredient.ingred_quantity));
        
        test = test || this.state.rec_name === "";
        test = test || this.state.rec_instructions === "";
        console.log(test);
        return test;
    }

    render() {
        // return (
        //     <Loading />
        // );

        console.log(JSON.stringify(this.state))
        console.log(JSON.stringify(this.props.curr_recipe.inProgress))

        if (this.props.curr_recipe.inProgress === "loading") {
            return (
                <Loading />
            )
            
        } else if(this.props.curr_recipe.inProgress === "update_success") {
            return (<Redirect to="/myrecipes" />)
        } else {
            return (
                <Form className="edit-form" onSubmit={event => this.handleSubmit(event)}>
                {(() => {
                    if(this.props.curr_recipe.inProgress === "update_failed"){
                        return <Alert severity="error">{this.props.curr_recipe.errMess}</Alert>;
                    }
                })()}

                    <div className="container-fluid">
    
                        <div className="row">
                            <div className="col-12 col-md-6 recipe-details-left-box">
                                {this.renderTitle()}
    
                                {/* {this.renderIngredients()} */}
                                <RecipeIngredients ingredients={this.state.ingredient} 
                                    handleIngredient= {this.handleIngredient}
                                />
                            </div>
    
                            <div className="col-12 col-md-6 recipe-details-steps-box">
                                <div>
                                    <div className="recipe-details-steps-title">
                                        <h4 style={{verticalAlign:"middle", margin:"0"}}>Recipe</h4>
                                    </div>
                                    {this.renderSteps()}
                              
                                </div>
                            </div>
                            
                        </div>
                        <div className="row" style={{position: "relative", width: "100%", height: "100px"}}>
                            <div className="confirm-cancel-button">
                                <button type="submit" className="confirm-button btn btn-success"
                                    disabled= {this.isDisabled()}
                                >Confirm</button>
                                <Link to="/myrecipes">
                                    <button type="button" className="cancel-button btn btn-danger" >Cancel</button>
                                </Link>
                                
                            </div>
                            
                        </div>
                    </div>
                </Form>
            )
        }
        
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewRecipePage));