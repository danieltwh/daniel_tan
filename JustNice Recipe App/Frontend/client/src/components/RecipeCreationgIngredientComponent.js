import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Card, CardImg, CardTitle} from 'reactstrap';
import { Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import { Col, Row, Navbar, NavbarBrand, Button, Form, FormGroup, FormFeedback, FormText, Label, Input } from 'reactstrap';
import {LocalForm, Control, Errors} from 'react-redux-form'

import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';


import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { baseUrl } from '../shared/baseUrl';



class RecipeIngredients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: this.props.ingredients,
            unknown_ingredients: 0
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.trackContent = this.trackContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
    }

    componentDidMount() {
        if (this.textArea) {
            this.trackContent(this.textArea)
        }
        if (this.recipeName) {
            this.trackContent(this.recipeName)
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

    handleSubmit() {
        //console.log(JSON.stringify(this.state))
        alert(JSON.stringify(this.state))
    }

    trackContent(element) {
        
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    }

    handleOnDragEnd(result) {
        if (!result.destination) {
            return;
        }
        const items = Array.from(this.state.ingredients);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        this.setState({
            ingredients: items
        })
        this.props.handleIngredient(items);
    }

    handleIngredientNameChange(id, name, isValid, newValue) {
        var newList  = this.state.ingredients.map(ingredient => {
            if (ingredient.ingred_id === id) {
                var validity;
                if (newValue === "") {
                    validity = "required";
                } else {
                    validity = "init";
                }
                return ({...ingredient, "ingred_name": newValue, isValid: validity});
            } else {
                return (ingredient);
            }
        });

        this.setState({
            ingredients: newList
        });
        this.props.handleIngredient(newList);
    }

    handleIngredientQuantityChange(id, name, isValid, newValue) {
        var newList  = this.state.ingredients.map(ingredient => {
            if (ingredient.ingred_id === id) {
                var validity;
                if (name === "") {
                    validity = "required"
                } else {
                    validity = isValid
                }
                return ({...ingredient, "ingred_quantity": newValue, isValid: validity});
            } else {
                return (ingredient);
            }
        });

        this.setState({
            ingredients: newList
        });
        this.props.handleIngredient(newList);
    }

    handleIngredientUnitChange(id, name, isValid, newValue) {
        //console.log("Ingredient unit changing..");
        var newList  = this.state.ingredients.map(ingredient => {
            if (ingredient.ingred_id === id) {
                var validity;
                if (name === "") {
                    validity = "required"
                } else {
                    validity = isValid
                }
                return ({...ingredient, "ingred_unit": newValue, isValid: validity});
            } else {
                return (ingredient);
            }
        });

        this.setState({
            ingredients: newList
        });
        this.props.handleIngredient(newList);
    }

    addNewIngredient() {
        var newList = this.state.ingredients;

        var newIngredient = {
            ingred_id: `Uncat${this.state.unknown_ingredients}`,
            ingred_name: "",
            ingred_unit: "ml",
            ingred_cat: "",
            ingred_quantity: "",
            isValid: "init"
        }

        newList.push(newIngredient);

        this.setState({
            unknown_ingredients: this.state.unknown_ingredients + 1,
            ingredients: newList
        });

        this.props.handleIngredient(newList);
    }
    

    handleDeleteIngredient(id, name) {
        var newList;
        if (id !== null) {
            newList = this.state.ingredients.filter((ingredient) => ingredient.ingred_id !== id)
        } else {
            newList = this.state.ingredients.filter((ingredient) => ingredient.ingred_name !== name)
        }

        this.setState({
            ingredients: newList
        });
        this.props.handleIngredient(newList);
    }

    renderIngredients() {
        const ingredients = this.state.ingredients.map(({ingred_id, ingred_name, ingred_unit, ingred_category, ingred_quantity, isValid}, index) => {
            // var drag_id
            // if (id !== null && name !== null) {
            //     drag_id = `${id}`
            // } else {
            //     drag_id = `Uncat${count}`
            //     count = count + 1;
            // } 

            return (
                <Draggable key={JSON.stringify(ingred_id)} draggableId={JSON.stringify(ingred_id)} index={index} handle=".handle">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className="container-fluid ingredient-input"
                            // style={{paddingLeft:"0px"}}
                        >
                            <div className="form-row">
                                <div className="col-1">
                                    
                                    <button type="button" className="delete-ingredient"
                                        onClick={() => {
                                            this.handleDeleteIngredient(ingred_id, ingred_name);
                                        }}
                                    >
                                        <FontAwesomeIcon icon="minus-square" pull="left" className="delete-ingredient-icon"/>
                                    </button>
                                    
                                    
                                </div>

                                <div className="col-10">
                                    <div className="form-row">
                                        <div className="col-7 ingredient-name-input">
                                            <Input type="text" className="form-control" value={ingred_name}
                                                onChange= {(event) => this.handleIngredientNameChange(ingred_id, ingred_name, isValid, event.target.value)}
                                                onBlur= {(event) => {this.validateIngredient(ingred_id, ingred_quantity, event)}}
                                                valid= {isValid == "valid"}
                                                invalid={isValid !== "valid" && isValid !== "init" && isValid !=="no-action"}
                                            />
                                            {(() => {
                                                if (isValid === "init" ) {

                                                } else if (isValid === "required") {
                                                    return (<FormFeedback>Required</FormFeedback>);
                                                } else {
                                                    return (<FormFeedback>Ingredient not found and will be <strong>uncategorised</strong></FormFeedback>);
                                                } 
                                            })()}
                                        </div>
                                        
                                        
                                        
                                        <div className="col-5">
                                            <div className="form-row" >
                                                <input type="text" className="form-control col-md-6 col-5" value={ingred_quantity}
                                                     onChange= {(event) => this.handleIngredientQuantityChange(ingred_id, ingred_name, isValid, event.target.value)}
                                                >
                                                   
                                                </input>
                                                
                                                <div className="input-group-text col-md-6 col-7 ingredient-unit" >
                                                    {(() => {
                                                        if(isValid === "valid"){
                                                            return <span >{ingred_unit}</span>
                                                        } else {
                                                            return (
                                                                <FormControl style={{width:"100%"}}>
                                                                {/* <InputLabel id="demo-customized-select-label">Quantity</InputLabel> */}
                                                                    <Select value={ingred_unit}
                                                                    labelId="demo-customized-select-label"
                                                                    id="demo-customized-select"
                                                                    onChange={(event) => this.handleIngredientUnitChange(ingred_id, ingred_name, isValid, event.target.value)}
                                                                    >
                                                                        <MenuItem value="ml">ml</MenuItem>
                                                                        <MenuItem value="g">g</MenuItem>
                                                                        <MenuItem value="whole">whole</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                                
                                            </div>
                                            
                                        </div>
                                        
                                        {/* <img src="/assets/recipe-3.jpeg" width="20px" height="20px"/> */}
                                    </div>
                                </div>

                                <div className="handle input-group-append col-1" {...provided.dragHandleProps}>
                                    <span className="input-group-text ingredient-handle">
                                        <FontAwesomeIcon icon="grip-vertical"/>
                                    </span>
                                </div>

                            </div>
                        </div>
                    )}
                </Draggable>
            )}
        )

        return (
            <>
                {ingredients}  
            </>
            
        );
    }

    isEmpty(value){
        const no_whitespace = /^\S+$/;
        return (value === "" || !no_whitespace.test(value)); 
    }

    notJustWhiteSpace(value){
        const notWhiteSpace = /\S/;
        return notWhiteSpace.test(value);
    }

    validateIngredient(id, quantity, event) {
        const {target} = event;
        var value = target.type === "checkbox" ? target.checked : target.value;
        const {name} = target;

        // value = value.replace(/\d|\s{1,}/g, ''); // Removing any numbers and white spaces before the text
        
        value = value.replace(/\d+/, ""); // Removing any digits
        value = value.replace(/^[^A-Za-z]+/, ""); // Removing any numbers and white spaces before the text
        value = value.replace(/^\s+|\s+$/g, ""); // Removing spaces at the start and at the end
        value = value.replace(/\s{2, }/g, " "); // Replacing 2 spaces with just 1 space

        if (this.notJustWhiteSpace(value)) {

            fetch(baseUrl + "recingred/checkingred/", {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    "ingred_name": value
                })
            })
            .then(resp => {
                return resp.json();
            })
            .then(resp => {
                // alert(JSON.stringify({name: value}));
                
                // alert(JSON.stringify(resp));

                if (resp[Object.keys(resp)[0]] !== "D") {
                    resp = {...resp, ingred_quantity: quantity, isValid: "valid"}

                    var newList  = this.state.ingredients.map(ingredient => {
                        if (ingredient.ingred_id === id) {
                            
                            return (resp);
                        } else {
                            return (ingredient);
                        }
                    });
    
                    this.setState({
                        ingredients: newList
                    });
                    this.props.handleIngredient(newList);
                } else {
                    var newList  = this.state.ingredients.map(ingredient => {
                        if (ingredient.ingred_id === id) {
                            
                            return ({...ingredient, isValid: "invalid"});
                        } else {
                            return (ingredient);
                        }
                    });
                    this.setState({
                        ingredients: newList
                    });
                    this.props.handleIngredient(newList);
                }
            })

            // alert(JSON.stringify({name: value}));
            // var newList  = this.state.ingredients.map(ingredient => {
            //     if (ingredient.ingred_id === id) {
                    
            //         return ({...ingredient, "ingred_name": value, isValid: "invalid"});
            //     } else {
            //         return (ingredient);
            //     }
            // });

            
        } else {
            // alert(JSON.stringify({name: value}));
            var newList  = this.state.ingredients.map(ingredient => {
                if (ingredient.ingred_id === id) {
                    
                    return ({...ingredient, "ingred_name": value, isValid: "required"});
                } else {
                    return (ingredient);
                }
            });

            this.setState({
                ingredients: newList
            });
            this.props.handleIngredient(newList);
        }
    }
    

    render() {

        //console.log(JSON.stringify(this.state.ingredients))
        return (
            <div className="recipe-details-ingredient-box">
                
                <div className="recipe-details-ingredient-title">
                    <h4 style={{verticalAlign:"middle", margin:"0"}}>Ingredients</h4>
                </div>
                <div className="recipe-creation-ingredient">
            
                    <DragDropContext onDragEnd={this.handleOnDragEnd}>
                        <Droppable droppableId="ingredients">
                            {(provided) => (
                                <div className="ingredients" {...provided.droppableProps} ref={provided.innerRef}
                                    // style={{paddingLeft:"25px"}}
                                >
                                    {this.renderIngredients()}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        
                    </DragDropContext>

                    <div className="container-fluid ingredient-input">
                        <div className="row">
                            <div className="col-1 offset-10" >
                                <button type="button" className="add-ingredient-button"
                                    onClick = {() => this.addNewIngredient()}
                                    
                                >
                                    <FontAwesomeIcon icon="plus-square" size="2x"/>
                                </button>
                            </div>

                        </div>
                    </div>
                    
                </div>
                
                
            </div>
            
            
        )
    }
}

export default RecipeIngredients;