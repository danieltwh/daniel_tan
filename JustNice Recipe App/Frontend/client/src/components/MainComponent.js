import React, {Component} from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {connect} from "react-redux";

import {RECIPES} from "../shared/recipes";
import {MY_RECIPES} from "../shared/my_recipes";

// In App Pages
import LoginPage from "./LoginPageComponent";
import AccountPage from './AccountPageComponent';
import Header from "./HeaderComponent";
import ExplorePage from "./ExploreComponent";
import MyRecipePage from './MyRecipeComponent';


import RecipeDetailsPage from './RecipeDetailsComponent';
import RecipeCreationPage from "./RecipeCreationComponent";
import NewRecipePage from "./NewRecipeComponent";

import MyGroceryListPage from "./MyGroceryListPageComponent";
import GroceryList from './GroceryListComponent';
import {PrivateRoute} from "./PrivateRoute";

// Public Pages
import PublicHeader from "./PublicHeaderComponent";
import PublicHomePage from './PublicHomePageComponent';
import PublicAboutUsPage from "./PublicAboutUsComponent";
import SignupPage from "./SignupPageComponent";


import {login_attempt, login_success, signout, load_myrecipes, get_recipe} from "../redux/ActionCreators";
import {  load_myrecipes_reset, load_recipe_image_reset, get_recipe_reset, load_explore_recipes_reset, load_myGrocList_reset, 
load_recipe_image_success, load_recipe_image_default } from "../redux/ActionCreators";




const mapStateToProps = state => {
  return {
    login: state.login,
    recipes: state.recipes,
    my_recipes: state.my_recipes,
    curr_recipe: state.curr_recipe,
    groceryList: state.groceryList,
    curr_grocList : state.curr_grocList,
    images: state.images,
  }
}

const mapDispatchToProps = (dispatch) => ({
  login_attempt: (username, password) => dispatch(login_attempt(username, password)),
  signup_success: (user) => dispatch(login_success(user)),
  signout: () => dispatch(signout()),
  load_myrecipes: (user_id) => {dispatch(load_myrecipes(user_id))},
  get_recipe: (rec_id) => dispatch(get_recipe(rec_id)) ,

  load_myrecipes_reset: () => { dispatch(load_myrecipes_reset()) },
  get_recipe_reset: () => dispatch(get_recipe_reset()),
  
  load_recipe_image_reset: () => dispatch(load_recipe_image_reset()),
  load_recipe_image_success: (details) => dispatch(load_recipe_image_success(details)),
  load_recipe_image_default: () => dispatch(load_recipe_image_default()),

  load_explore_recipes_reset: () => dispatch(load_explore_recipes_reset()),
  load_myGrocList_reset: () => dispatch(load_myGrocList_reset()),
});


class Main extends Component {

    constructor(props) {
        super(props);

        // this.state = {
        //     recipes: RECIPES,
        //     my_recipes: MY_RECIPES,
        //     token: null
        // }
    }

    componentDidMount() {
      // this.props.load_myrecipes(1);
      
    }

    atExplore(){
      if(this.props.curr_recipe.inProgress !== "idle"){
        this.props.get_recipe_reset();
        this.props.load_recipe_image_reset();
      }

      if(this.props.my_recipes.inProgress !== "not-loaded"){
        this.props.load_myrecipes_reset();
      }

      if(this.props.groceryList.inProgress !== "idle") {
            this.props.load_myGrocList_reset();
      }

      if(this.props.images.recipe.inProgress !== "idle") {
        this.props.load_recipe_image_reset();
      }
    }

    atMyRecipe(){
      // alert("at myrecipe")
      if(this.props.curr_recipe.inProgress !== "idle"){
        this.props.get_recipe_reset();
        this.props.load_recipe_image_reset();
      }

      if(this.props.recipes.inProgress !== "idle"){
        this.props.load_explore_recipes_reset();
      }

      if(this.props.groceryList.inProgress !== "idle") {
            this.props.load_myGrocList_reset();
      }

      if(this.props.images.recipe.inProgress !== "idle") {
        this.props.load_recipe_image_reset();
      }
    }

    atNewRecipe(){
      if(this.props.recipes.inProgress !== "idle"){
        this.props.load_explore_recipes_reset();
      }

      if(this.props.my_recipes.inProgress !== "not-loaded"){
        this.props.load_myrecipes_reset();
      }

      if(this.props.groceryList.inProgress !== "idle") {
        this.props.load_myGrocList_reset();
      }

      if(this.props.images.recipe.inProgress !== "default" ) {
        this.props.load_recipe_image_default();
      }      

      // if(this.props.images.recipe.inProgress !== "idle" ) {
      //   this.props.load_recipe_image_reset();
      // }

      // if(this.props.images.recipe.inProgress !== "idle") {

      //   // this.props.load_recipe_image_reset();
      //   var dummy = {filename: "",
      //   status: "default",
      //   url: "/media/default.jpg"}
      //   this.props.load_recipe_image_success(dummy)
      // }
    }

    atEdit(){
      if(this.props.recipes.inProgress !== "idle"){
        this.props.load_explore_recipes_reset();
      }

      if(this.props.my_recipes.inProgress !== "not-loaded"){
        this.props.load_myrecipes_reset();
      }

      if(this.props.groceryList.inProgress !== "idle") {
            this.props.load_myGrocList_reset();
      }
    }

    atAccount(){
      if(this.props.recipes.inProgress !== "idle"){
        this.props.load_explore_recipes_reset();
      }

      if(this.props.my_recipes.inProgress !== "not-loaded"){
        this.props.load_myrecipes_reset();
      }

      if(this.props.curr_recipe.inProgress !== "idle"){
        this.props.get_recipe_reset();
        this.props.load_recipe_image_reset();
      }

      if(this.props.groceryList.inProgress !== "idle") {
            this.props.load_myGrocList_reset();
      }

      if(this.props.images.recipe.inProgress !== "idle") {
        this.props.load_recipe_image_reset();
      }
      
    }

    atGroceryList(){
      if(this.props.recipes.inProgress !== "idle"){
        this.props.load_explore_recipes_reset();
      }

      if(this.props.my_recipes.inProgress !== "not-loaded"){
        this.props.load_myrecipes_reset();
      }

      if(this.props.curr_recipe.inProgress !== "idle"){
        this.props.get_recipe_reset();
        this.props.load_recipe_image_reset();
      }

      if(this.props.images.recipe.inProgress !== "idle") {
        this.props.load_recipe_image_reset();
      }
    }

    atCurrGrocList(){
      if(this.props.recipes.inProgress !== "idle"){
        this.props.load_explore_recipes_reset();
      }

      // if(this.props.my_recipes.inProgress !== "not-loaded"){
      //   this.props.load_myrecipes_reset();
      // }

      if(this.props.curr_recipe.inProgress !== "idle"){
        this.props.get_recipe_reset();
        this.props.load_recipe_image_reset();
      }

      if(this.props.groceryList.inProgress !== "idle") {
            this.props.load_myGrocList_reset();
      }

      if(this.props.images.recipe.inProgress !== "idle") {
        this.props.load_recipe_image_reset();
      }
    }

    render() {
      //console.log(JSON.stringify(this.props))
      //console.log(JSON.stringify(this.props.location.pathname))

      const checkCurrGrocList = /\/grocerylist\/\d/
      // console.log(this.props.location.pathname.test(checkCurrGrocList));
      // console.log(checkCurrGrocList.test(this.props.location.pathname));

      if (this.props.login.user) {
        if(this.props.location.pathname === "/explore"){
          this.atExplore();
        } else if (this.props.location.pathname === "/newrecipe"){
          this.atNewRecipe()
        } else if(this.props.location.pathname.substring(0,5) === "/edit"){
          this.atEdit();
        } else if(this.props.location.pathname === "/myrecipes" || this.props.location.pathname === "/myrecipes/" ){
          this.atMyRecipe();
        } else if(this.props.location.pathname === "/account"){
          this.atAccount();
        } else  if (this.props.location.pathname === "/grocerylist"){
          this.atGroceryList();
        } else if(checkCurrGrocList.test(this.props.location.pathname)){
          this.atCurrGrocList();
        }


        return (
          <div>
            <Header signout={this.props.signout}/>
            <Switch>
              {/* <Route path="/login" component={() => <LoginPage login_attempt={this.props.login_attempt} />} /> */}

              <Route exact path="/account" component={AccountPage} />
            
              <Route exact path="/explore" component={() => <ExplorePage recipes={this.props.recipes.recipes} />} />

              <Route exact path="/explore/:recipeID" component={({match}) => <RecipeDetailsPage rec_id={(parseInt(match.params.recipeID, 10))} />  } />

              <Route exact path="/edit/:recipeID" component={({match}) => <RecipeCreationPage rec_id={parseInt(match.params.recipeID, 10)} />} 
              />

              {/* <Route exact path="/newrecipe" component={() => <NewRecipePage />} /> */}

              <Route exact path="/newrecipe" component={({match}) => <RecipeCreationPage rec_id="new" />} />
              
              <Route exact path="/myrecipes" component={MyRecipePage} />
              
              <Route exact path="/myrecipes/:recipeID" component={({match}) => {
                // this.props.get_recipe(parseInt(match.params.recipeID, 10))
                return (
                <RecipeDetailsPage rec_id={(parseInt(match.params.recipeID, 10))} />  
                )}
              }/> 
                
                            
              <Route exact path="/grocerylist" component={() => <MyGroceryListPage groceryLists={MY_RECIPES}/> } />
              <Route exact path="/grocerylist/:groceryListID" component={({match}) => <GroceryList recipes={MY_RECIPES} groc_id={parseInt(match.params.groceryListID, 10)} /> } />
              
              <Redirect to="/explore" />
            </Switch>
          </div>
        );
      } else {
        //console.log("Not Login")
        return (
          <div style={{padding:"0"}}>
            <PublicHeader/>
            <Switch>
              <Route path="/login" component={() => <LoginPage login_attempt={this.props.login_attempt} />} />
              <Route path="/home" component={() => <PublicHomePage />} />
              {/* <Route path="/aboutus" component={() => <PublicAboutUsPage />} /> */}
              <Route path="/signup" component={() => <SignupPage signup_success={this.props.signup_success}/>} />
              <Redirect to="/home" />
            </Switch>
          </div>
        )
      }
        
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));