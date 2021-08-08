import React, { Component } from 'react';
// import {Card, CardImg, CardTitle} from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
    Col, Row, Navbar, NavbarBrand, Form, FormGroup, FormFeedback, FormText, Label,
    InputGroup, InputGroupAddon, InputGroupText, Input
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';


import Loading from "./LoadingComponent";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Image from "material-ui-image";

import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";

import { load_myrecipes, load_myrecipes_reset, load_currGrocList } from "../redux/ActionCreators";
import { baseUrl } from '../shared/baseUrl';


const mapStateToProps = state => {
    return {
        login: state.login,
        my_recipes: state.my_recipes,
        curr_grocList: state.curr_grocList
    }
}

const mapDispatchToProps = (dispatch) => ({
    load_myrecipes: (user_id) => { dispatch(load_myrecipes(user_id)) },
    load_myrecipes_reset: () => { dispatch(load_myrecipes_reset()) },
    load_currGrocList: (user_id, groc_id) => { dispatch(load_currGrocList(user_id, groc_id)) }
});

class AddRecipe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groceryListName: this.props.curr_grocList.grocery.list_name,
            grocery_id: this.props.groc_id,
            toAdd: {}
        };
        this.addDefaultSrc = this.addDefaultSrc.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeRecipeQuantity = this.handleChangeRecipeQuantity.bind(this);
    }

    componentDidMount() {
        if (this.props.my_recipes.inProgress === "not-loaded") {
            //console.log(this.props.my_recipes.inProgress);
            this.props.load_myrecipes(this.props.login.user.id);
        }
    }

    // componentWillUnmount() {

    //     if (this.props.my_recipes.inProgress === "success" && this.props.my_recipes.my_recipes.length >= 1 ) {
    //         console.log(this.props.my_recipes.inProgress);
    //         this.props.load_myrecipes_reset();
    //     }  
    // }


    addDefaultSrc(event) {
        event.target.src = "/assets/recipe-1.jpeg";
        event.target.onerror = null;
    }


    renderRecipes(recipes) {
        const recipesTiles = recipes.map(recipe => {
            return (
                <div key={recipe.rec_id} className="col-6 col-sm-4 col-lg-3 col-xl-2">
                    <Card className="grocList-recipe-tile" >
                        <Image className="recipe-tile-img" src={`${baseUrl}${recipe.url}`}
                            width="100px" height="100px"
                        />
                        <CardContent>{recipe.rec_name}</CardContent>
                        <div className="container" >
                            <div className="form-row" style={{ marginBottom: "5px" }}>
                                <Button type="button" className="col-3 minus-button" onClick={() => this.handleButton(recipe.rec_id, -1)} >
                                    <FontAwesomeIcon icon="minus" />
                                </Button>
                                <input value={this.getRecipeValue(recipe.rec_id)} name={recipe.rec_id} className="col-6" 
                                style={{ textAlign: "center", border: "1px solid #ced4da"}}
                                    onChange={e => this.handleChangeRecipeQuantity(e.target.name, parseInt(e.target.value, 10))}
                                ></input>
                                <Button color="info" type="button" className="col-3 plus-button" onClick={() => this.handleButton(recipe.rec_id, 1)}>
                                    <FontAwesomeIcon icon="plus" />
                                </Button>
                            </div>

                        </div>


                    </Card>
                </div>
            )
        });
        return recipesTiles;
    }

    getRecipeValue(name) {
        if (name in this.state.toAdd) {
            return (this.state.toAdd[name]);
        } else {
            return ("");
        }
    }

    handleChangeRecipeQuantity(name, newVal) {
        // const target = event.target;
        // const name = target.name;
        // const newVal = target.type === 'checkbox' ? target.checked : target.value;

        if (newVal > 0) {
            var newToAdd = { ...this.state.toAdd };
            newToAdd[name] = newVal;
            this.setState({ toAdd: newToAdd });
        } else {
            var newToAdd = { ...this.state.toAdd };
            if (name in newToAdd) {
                delete newToAdd[name];
            }
            this.setState({ toAdd: newToAdd });
        }
    }

    handleButton(name, incr) {
        var newToAdd = { ...this.state.toAdd };
        if (!(name in newToAdd)) {
            newToAdd[name] = 0;
        }
        newToAdd[name] = Math.max(0, newToAdd[name] + incr);

        if (newToAdd[name] === 0){
            delete newToAdd[name];
        }

        this.setState({ toAdd: newToAdd });
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const newVal = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]: newVal,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        // alert(JSON.stringify(this.state));
        var toSend = { ...this.state.toAdd };
        toSend["list_name"] = this.state.groceryListName;

        // alert(JSON.stringify(toSend));

        return fetch(baseUrl + `groclist/update/${this.props.login.user.id}/${this.state.grocery_id}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                toSend
            )
        })
            .then(resp => resp.json())
            .then(resp => {
                //console.log(JSON.stringify(resp));
                if (resp.status === "Successfully updated") {
                    this.props.load_currGrocList(this.props.login.user.id, this.props.groc_id);
                } else {
                }
            })
            .catch(err => {
                //console.log(err)
            });
    }

    render() {
        //console.log(JSON.stringify(this.state));
        return (
            <Modal size="xl" isOpen={this.props.isEdit} toggle={event => this.props.toggleEdit(event)} className="">
                <form onSubmit={event => this.handleSubmit(event)}>
                    <ModalHeader toggle={event => this.props.toggleEdit(event)}>
                        <input name="groceryListName" value={this.state.groceryListName} onChange={e => this.handleChange(e)}></input>
                    </ModalHeader>
                    <ModalBody>
                        <div className="container-fluid">
                            <div className="row">
                                {this.renderRecipes(this.props.my_recipes.my_recipes)}
                            </div>
                        </div>


                    </ModalBody>
                    <ModalFooter style={{ overflow: "auto", justifyContent: "center" }}>
                        <div style={{ width: "90%" }}>
                            <Button className="grocList-cancel-button" color="secondary" onClick={event => this.props.toggleEdit(event)}>
                                <FontAwesomeIcon icon="times" />&nbsp; <strong>Cancel</strong>
                            </Button>


                            <Button type="submit" className="grocList-confirm-button" color="success" onClick={event => this.handleSubmit(event)}>
                                <FontAwesomeIcon icon="check" />&nbsp; <strong>Confirm</strong>
                            </Button>
                        </div>

                    </ModalFooter>
                </form >
            </Modal>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddRecipe));