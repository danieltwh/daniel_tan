import React, {Component} from  'react';
import { Button, Card, CardImg, CardTitle} from 'reactstrap';
import { Col, Row, Form, FormGroup, Label, Input } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";

import AddRecipe from './AddRecipeComponent';
import Loading from "./LoadingComponent";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { load_myrecipes, load_myrecipes_reset, load_currGrocList, load_currGrocList_reset } from "../redux/ActionCreators";
import Add from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';
// import Button from '@material-ui/core/Button';


import { baseUrl } from '../shared/baseUrl';




const mapStateToProps = state => {
    return {
      login: state.login,
      my_recipes: state.my_recipes,
      curr_grocList: state.curr_grocList
    }
  }
  
const mapDispatchToProps = (dispatch) => ({
    load_myrecipes: (user_id) => {dispatch(load_myrecipes(user_id))},
    load_myrecipes_reset: () => {dispatch(load_myrecipes_reset())},
    load_currGrocList: (user_id, groc_id) => {dispatch(load_currGrocList(user_id, groc_id))},
    load_currGrocList_reset: () => {dispatch(load_currGrocList_reset())}
    
});

class GroceryList extends Component {
    constructor(props) {
        super(props);

        // var categories = {...this.props.curr_grocList.grocery};
        // delete categories["list_name"];
    
        // var toUpdate = {};
        // for (const category in categories) {
        //     for(const ingred in categories[category]){
        //         toUpdate[ingred.ingred_id] = ingred.isBought;
        //     }
        // }

        this.state = {
            isEdit: false,
            resetConfirm: false,
            grocery: this.props.curr_grocList.grocery,
            toUpdate: {}
        }

        this.toggleEdit = this.toggleEdit.bind(this);
        this.whenEditOpen = this.whenEditOpen.bind(this);
        this.whenEditClose = this.whenEditClose.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.curr_grocList.inProgress === "idle") {
            // alert(this.props.groc_id);
            this.props.load_currGrocList(this.props.login.user.id, this.props.groc_id)
            
        }
    }

    // componentDidUpdate() {
    //     var categories = {...this.props.curr_grocList.grocery};
    //     delete categories["list_name"];
    
    //     var newToUpdate = {};
    //     for (const category in categories) {
    //         for(const ingred in categories[category]){
    //             newToUpdate[ingred.ingred_id] = ingred.isBought;
    //         }
    //     }

    //     this.setState({toUpdate: newToUpdate})
    //     console.log(this.state);
        
    // }

    componentWillUnmount() {
        if (this.props.curr_grocList.inProgress === "success" && Object.entries(this.state.toUpdate).length !== 0 ) {
            // alert("Reseting Current Grocery List");

            var finalToUpdate = {};

            for(var name in this.state.toUpdate){
                finalToUpdate[name] = (this.state.toUpdate[name]) ? "True" : "False"
            }

            // alert(JSON.stringify(finalToUpdate));

            return fetch(baseUrl + `groclist/update/${this.props.login.user.id}/${this.props.groc_id}/`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(finalToUpdate)
            })
            .then(resp => this.props.load_currGrocList_reset())
            .catch(err => {
                //console.log(err)
            });
        } else if (this.props.curr_grocList.inProgress === "success") {
            this.props.load_currGrocList_reset();
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        if (!nextState.isEdit) {
            return true;
        } else  if (nextState.toUpdate !== this.state.toUpdate) {
            //console.log("toUpdate changed so updating component")
            return true;
        }else if (this.state.isEdit && nextProps.grocery === this.props.grocery) {
            // If the modal is open and grocery list is the same,
            // we do not update
            return false;
        } else {
            //  Otherwise, we proceed to update
            return true;
        }
    }

    toggleEdit(event) {
        event.preventDefault();
        this.setState({isEdit: !this.state.isEdit});
        // console.log(JSON.stringify(this.state.isEdit));
        if (this.state.isEdit) {
            this.whenEditClose();
        } else {
            this.whenEditOpen();
        }
    }

    whenEditOpen() {
        if (this.props.my_recipes.inProgress === "not-loaded") {
            ////console.log(this.props.my_recipes.inProgress);
            // this.props.load_myrecipes(1);
        }   
    }

    whenEditClose() {
        if (this.props.my_recipes.inProgress === "success" && this.props.my_recipes.my_recipes.length >= 1 ) {
            //console.log(this.props.my_recipes.inProgress);
            this.props.load_myrecipes_reset();
        }  
    }

    handleIngredBought(event) {
        // event.preventDefault();
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        //console.log(`Changing ${name} to ${value}`);

        var newToUpdate = {...this.state.toUpdate};
        newToUpdate[name] = value;
        this.setState({toUpdate: newToUpdate});
        //console.log(`Changed ${name} to ${value}`);
    }

    handleIngredBought_Div(name) {
        // event.preventDefault();
        var newValue = (name in this.state.toUpdate) ? !this.state.toUpdate[name] : true;

        //console.log(`Changing ${name} to ${newValue}`);

        var newToUpdate = {...this.state.toUpdate};
        newToUpdate[name] = newValue;
        this.setState({toUpdate: newToUpdate});
        //console.log(`Changed ${name} to ${newValue}`);
    }

    IngredientItem(category, props) {
        return (
            <div key={props.ingred_id} className="row ingredient-item" >
                    <input key={props.ingred_id} type="checkbox" name={props.ingred_id} id={props.ingred_id} className="col-2 ingredient-item-checkbox" defaultChecked={props.isBought}
                        onChange={e => this.handleIngredBought(e)}
                    />
                    <label htmlFor={props.ingred_name} className="col-7 ingredient-item-description strikethrough">{props.ingred_name}<br/>{`${props.ingred_quantity}${props.ingred_unit}`}</label>
            </div>
    
            // <label  for={props.name} className="row ingredient-item">
            //         <input type="checkbox" name={props.name} className="col-2 ingredient-item-checkbox" />
            //         <span className="col-7 ingredient-item-description">{props.name}<br/>800g</span>
            // </label>
    
            
        );
    }
    
    IngredientCategory(category, ingredients) {
        const ingredientItems = ingredients.map((ingredient) => this.IngredientItem(category, ingredient) )
    
        return (
            <div className="col-12 col-md-4 ingredient-category">
            <div className=" "></div>
                <h4 className="ingredient-category-title">{category}</h4>
                {ingredientItems}
            </div>
        )
    }
    
    RenderGrocery(groceryList){
        var categories = {...groceryList};
        delete categories["list_name"];
    
        var result = []
        for (const category in categories) {
            result.push(this.IngredientCategory(category, categories[category]));
        }
        return (result);
    }

    resetConfirm(event) {
        event.preventDefault();

        this.setState({resetConfirm: !this.state.resetConfirm})
    }

    reset(event) {
        event.preventDefault();
        

        if (this.props.curr_grocList.inProgress === "success" && Object.entries(this.props.curr_grocList.grocery).length >= 0 ) {
            // alert("Reseting Current Grocery List");

            var categories = {...this.props.curr_grocList.grocery};
            delete categories["list_name"];

            var newToUpdate = {};

            for(var category in categories){
                var currCat = categories[category]
                for(var item in currCat){
                    var currIngred = currCat[item];
                    //console.log(JSON.stringify(currIngred));
                    newToUpdate[currIngred.ingred_id] = false
                }
            }
            
            this.setState({toUpdate: newToUpdate});
            
            var finalToUpdate = {};

            for(var name in newToUpdate){
                finalToUpdate[name] = (newToUpdate[name]) ? "True" : "False"
            }

            // alert(JSON.stringify(finalToUpdate));
               
            return fetch(baseUrl + `groclist/update/${this.props.login.user.id}/${this.props.groc_id}/`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(finalToUpdate)
            })
            .then(resp => this.props.load_currGrocList(this.props.login.user.id, this.props.groc_id))
            .catch(err => {
                //console.log(err)
            });         
        // } else if (this.props.curr_grocList.inProgress === "success") {
        //     this.props.load_currGrocList_reset();
        }
    }

    

    render() {
        const groceryListRecipes = this.props.recipes.filter(recipe => recipe.id===1)[0];
        //console.log(JSON.stringify(this.state));

        return (
            <>
            
            <form>

                <div className="container-fluid grocery-list-table">

                   


                    <div className="row groceryList-title">
                        <div className="ml-auto mr-auto">
                            <h2>{(this.props.curr_grocList.inProgress === "success") ? this.props.curr_grocList.grocery["list_name"] : "Grocery list"}</h2>
                        </div>
                    </div>

                     {(() => {
                        if (this.props.curr_grocList.inProgress === "failed") {
                            return (
                                <>
                                    <Alert severity="error">{this.props.groceryList.errMess}</Alert>
                                </>
                            )

                        } else if (this.props.curr_grocList.inProgress === "loading") {
                            return (
                                <>
                                    <Alert severity="info">Hold on...Serving up your grocery list soon!</Alert>
                                    <Loading />
                                </>
                            )
                        } else if (Object.entries(this.props.curr_grocList.grocery).length === 1) {
                            
                            return (
                                <Alert severity="info">
                                    You don't seem to have any groceries. Edit your list here!
                                    <Button onClick={(e) => this.toggleEdit(e) } 
                                    variant="contained" color="primary" style={{ marginLeft: "15px" }}>Edit Grocery List</Button>
                                </Alert>
                            )
                        }
                    })()}
                    
                    <div className="row">
                        {/* <RenderGrocery groceryList={this.props.curr_grocList.grocery} />  */}
                        {this.RenderGrocery(this.state.grocery)}
                        {/* <IngredientCategory category="Vegetables" ingredients={groceryListRecipes.ingredients} />
                        <IngredientCategory category="Meat" ingredients={groceryListRecipes.ingredients} />
                        <IngredientCategory category="Diary" ingredients={groceryListRecipes.ingredients} />
                        <IngredientCategory category="Bread and Cereal" ingredients={groceryListRecipes.ingredients} />
                        <IngredientCategory category="Bread and Cereal" ingredients={groceryListRecipes.ingredients} /> */}
                    </div>

                    
                </div>
            </form>

            <div style={{position: "relative", width: "100%", height: "100px"}}>
                <div className="edit-reset-button">
                    <button className="reset-button btn btn-danger" onClick={e => this.resetConfirm(e)}>
                        <span><FontAwesomeIcon icon="redo" />&nbsp; <strong>Reset</strong></span>
                    </button>

                    <button className="edit-button btn btn-info" onClick={this.toggleEdit}>
                        <span><FontAwesomeIcon icon="edit" />&nbsp; <strong>Edit</strong></span>
                    </button>
                </div>
            </div>

            <AddRecipe isEdit={this.state.isEdit} toggleEdit={this.toggleEdit} grocListName={this.props.curr_grocList.grocery.list_name} groc_id={this.props.groc_id} /> 

            <Modal size="md" isOpen={this.state.resetConfirm} toggle={event => this.resetConfirm(event)} className="">
                
                    <ModalHeader toggle={event => this.resetConfirm(event)}>
                        Reset Confirmation
                    </ModalHeader>
                    <ModalBody style={{fontSize: "large", textAlign: "center"}}>
                        Are you sure you want to reset this grocery list?
                    </ModalBody>
                    <ModalFooter style={{ overflow: "auto", justifyContent: "center" }}>
                        <div style={{ width: "80%" }}>
                            <Button className="grocList-cancel-button" color="secondary" onClick={event => this.resetConfirm(event)}>
                                <FontAwesomeIcon icon="times" />&nbsp; <strong>Cancel</strong>
                            </Button>


                            <Button type="submit" className="grocList-confirm-button" color="success" onClick={event => this.reset(event)}>
                                <FontAwesomeIcon icon="check" />&nbsp; <strong>Confirm</strong>
                            </Button>
                        </div>

                    </ModalFooter>
                
            </Modal>

            </>
            
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GroceryList));