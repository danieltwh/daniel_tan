import React, { Component, useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

// import { withRouter } from 'react-router';
// import { connect } from "react-redux";
import { baseUrl } from '../shared/baseUrl';
import { Link } from 'react-router-dom';
import Loading from "./LoadingComponent";
import SearchBar from "./SearchBarComponent";

// import {Card, CardImg, CardTitle} from 'reactstrap';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from "@material-ui/core/styles";
// import { MuiThemeProvider, createMuiTheme} from "material-ui/styles";

import { load_explore_recipes, load_explore_recipes_reset, get_recipe_reset, load_recipe_image_reset } from '../redux/ActionCreators';

import Alert from '@material-ui/lab/Alert';
import Image from "material-ui-image";

// const mapStateToProps = state => {
//     return {
//         login: state.login,
//         recipes: state.recipes,
//     }
//   }

// const mapDispatchToProps = (dispatch) => ({
//     load_explore_recipes: () => dispatch(load_explore_recipes()),
// });

const useStyles = makeStyles({
    titleItemRight: {
        color: 'white',
        backgroundColor: 'blue',
        top: '50%',
        height: 30,
        float: 'right',
        position: 'relative',
        transform: 'translateY(-50%)',
    },
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
    },
    pos: {
        marginBottom: 12,
    },

    recipeDetails: {
        padding: "2px 10px 5px 10px !important",
        alignItems: "center",

    },

    paper: {
        textAlign: "center",

    },
    paxDetails: {
        textAlign: "left",
        paddingLeft: "5px",
    },

    recTypeDetails: {
        textAlign: "left",
        paddingLeft: "5px",

    },

    cardBottom: {
        padding: 0,
        alignSelf: "bottom",
    }
});

// const breakpointValues = createMuiTheme({
//     breakpoints: {
//         values: {
//         xs: 0,
//         sm: 600,
//         md: 960,
//         lg: 1280,
//         xl: 1920,
//         },
//     },
// })

// const theme = createMuiTheme({ breakpoints: { values: breakpointValues } });

export default function ExplorePage() {
    const login = useSelector(state => state.login);
    const recipes = useSelector(state => state.recipes);
    const curr_recipe = useSelector(state => state.curr_recipe)
    const classes = useStyles();

    const dispatch = useDispatch();

    useEffect(() => {
        if (recipes.inProgress === "idle") {
            dispatch(load_explore_recipes());
        }

        // if (curr_recipe.inProgress !== "idle") {
        //     dispatch(get_recipe_reset())
        //     dispatch(load_recipe_image_reset())
        // }

        // return () => {
        //     if(recipes.inProgress === "success"){
        //         dispatch(load_explore_recipes_reset());
        //     }
        // }
    })

    function renderRecipes(recipes) {
        const recipesTiles = recipes.map(recipe => {
            return (
                <div key={recipe.rec_id} className="col-6 col-sm-4 col-lg-3 col-xl-2 ">
                    {/* <Grid item xs={6} sm={4} lg={3} xl={2}> */}
                    {/* <div className="recipe-tile"> */}

                    <Card className="recipe-tile" style={{ height: "95%", }}>
                    <Link to={`/explore/${parseInt(recipe.rec_id, 10)}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <CardContent >
                            <Typography className="recipe-tile-title">
                                {recipe.rec_name}
                            </Typography>
                        </CardContent>

                        
                        <Image className="recipe-tile-img" src={baseUrl + recipe.url} alt={recipe.rec_name} />
                        <CardContent className="recipe-tile-details-box">
                            <Grid container rowSpacing={2} columnSpacing={4} direction="row" justifyContent="center" alignItems="flex-start">
                                <Grid item xs={6} sm={6}>
                                    {/* <Paper > */}
                                    <Typography variant="body2" color="textSecondary" component="p" className="recipe-tile-details">
                                        Time: {recipe.cooking_time}min
                                    </Typography>
                                    {/* </Paper> */}
                                </Grid>
                                <Grid className={classes.paxDetails} item xs={6} sm={6} >
                                    {/* <Paper > */}
                                    <Typography variant="body2" color="textSecondary" component="p" className="recipe-tile-details">
                                        Pax: {recipe.serving_pax}
                                    </Typography>
                                    {/* </Paper> */}
                                </Grid>

                                <Grid item xs={6} sm={6} md={6}>
                                    {/* <Paper > */}
                                    <Typography variant="body2" color="textSecondary" component="p" className="recipe-tile-details">
                                        Cuisine: {recipe.cuisine}
                                    </Typography>
                                    {/* </Paper> */}

                                </Grid>
                                <Grid className={classes.recTypeDetails} item xs={6} sm={6} md={6}>
                                    {/* <Paper > */}
                                    <Typography variant="body2" color="textSecondary" component="p" className="recipe-tile-details">
                                        Type: {recipe.rec_type}
                                    </Typography>
                                    {/* </Paper> */}

                                </Grid>
                            </Grid>
                            {/* <Typography variant="body2" color="textSecondary" component="p">
                        Cooking Time: {recipe.cooking_time}min &nbsp;&nbsp;&nbsp; Pax: {recipe.serving_pax} <br/>
                        Cuisine: {recipe.cuisine}
                        </Typography> */}
                        </CardContent>
                    </Link>

                    
                    <CardActions className={classes.cardBottom}>
                        <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                            <Grid item>
                                <Button size="small" color="primary">Share</Button>
                            </Grid>
                        </Grid>
                    </CardActions>


                        {/* <CardActions>
                            <Button  className="share-button" size="small" color="primary" >
                                Share
                            </Button>
                        </CardActions> */}
                    </Card>

                    {/* </div> */}
                    {/* </Grid> */}
                </div>
            )
        });

        return recipesTiles;
    }

    return (
        <div className="container-fluid">
            {(() => {
                if (recipes.inProgress === "failed") {
                    return (
                        <Alert severity="error">{recipes.errMess}</Alert>
                    )
                } else if (recipes.inProgress === "inProgress") {
                    return (
                        <>
                            <Alert severity="info">Hold on...Serving up the recipes soon!</Alert>
                            <Loading />

                        </>

                    )
                }
            })()}
            <div className="row">
                {renderRecipes(recipes.recipes)}
            </div>
        </div>
        // <Grid container direction="row" rowSpacing={10} columnSpacing={{sm: 10, md: 10}} >

        //     {renderRecipes(recipes.recipes)}

        // </Grid>
    )

}






// class ExplorePage extends Component {
//     constructor(props) {
//         super(props);

//     }



//     componentDidMount() {
//         if(this.props.recipes.inProgress === "idle"){
//             this.props.load_explore_recipes();
//         }
//     }

//     renderRecipes(recipes) {
//         const recipesTiles = recipes.map(recipe => {
//             return (
//                 <div key={recipe.rec_id} className="col-6 col-sm-4 col-lg-3 col-xl-2">
//                     <Card className="recipe-tile">
//                         <CardHeader className="recipe-tile-title" title={recipe.rec_name} />
//                         <Image className="recipe-tile-img" src={baseUrl + recipe.url} alt={recipe.rec_name} />
//                         <CardContent>
//                             <Typography variant="body2" color="textSecondary" component="p">
//                             Cooking Time: {recipe.cooking_time} min &nbsp;&nbsp;&nbsp; Pax: {recipe.serving_pax} <br/>
//                             Cuisine: {recipe.cuisine}
//                             </Typography>
//                         </CardContent>
//                         <CardActions>
//                             <Grid container direction="row" justify="flex-end" alignItems="flex-start">
//                                 {/* <Grid item> */}
//                                     <Button size="small" color="primary">Share</Button>
//                                 {/* </Grid> */}
//                             </Grid>
//                         </CardActions>


//                         {/* <CardActions>
//                             <Button  className="share-button" size="small" color="primary" >
//                                 Share
//                             </Button>
//                         </CardActions> */}
//                     </Card>
//                 </div>
//             )
//         });

//         return recipesTiles;
//     }

//     render() {
//         return (
//             <div className="container-fluid">
//                 <div className="row">
//                     {this.renderRecipes(this.props.recipes.recipes)}
//                 </div>
//             </div>
//         )
//     }
// }

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExplorePage));