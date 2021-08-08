import React, { Component, useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom';

import { search_recipes, complex_search_recipes } from '../redux/ActionCreators';

import { makeStyles, withStyles, styled } from "@material-ui/core/styles";

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { InputAdornment, MenuItem, TextField } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import Button from '@material-ui/core/Button';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';

import PersonIcon from '@material-ui/icons/Person';

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
        width: "100%",
        padding: "0px 0px 0px 0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 20,
        padding: 0,
    },
    pos: {
        marginBottom: 12,
    },

    recipeDetails: {
        padding: "2px 10px 5px 10px",
        alignItems: "center",
    },

    gridRow: {
        margin: "10px 0px",
    },

    paper: {
        textAlign: "center",

    },
    paxDetails: {
        textAlign: "center",
    },

    cardBottom: {
        padding: 0,
        alignSelf: "bottom",
    }
});

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const initialState = {
    search: "",
    advanceSearch: "",
    cookingTime: null,
    servingPax: null,
    cuisine: "",
    recType: "",
    open: false,
};


export default function SearchBar() {
    const login = useSelector(state => state.login);

    const [search, setSearch] = useState("");
    const [advanceSearch, setAdvanceSearch] = useState("");
    const [cookingTime, setCookingTime] = useState(null);
    const [servingPax, setServingPax] = useState(null);
    const [cuisine, setCuisine] = useState("");
    const [recType, setRecType] = useState("");
    const [open, setOpen] = useState(false);
    const [searchErr, setSearchErr] = useState("");

    const location = useLocation();

    const classes = useStyles();

    const dispatch = useDispatch();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setSearchErr("")
        setOpen(false);
    };

    const handleSingleSearch = (event) => {
        event.preventDefault();
        if (location.pathname === "/explore") {
            // alert(JSON.stringify([open, search, cookingTime, servingPax, cuisine, recType]));
            const onlySpaces = /^\s*$/

            if (search === "" || onlySpaces.test(search)) {
                setSearch("")
                setAdvanceSearch("")
                setSearchErr("single-search-empty")
            } else {
                dispatch(search_recipes(search));
                setSearch("");
                setAdvanceSearch("")
            }
        } else {
            setSearch("")
            setAdvanceSearch("")
            setSearchErr("not-explore")
        }





    };

    const handleComplexSearch = (event) => {
        event.preventDefault();

        if (location.pathname === "/explore"){
            var toSend = []
            if(cookingTime !== null){
                toSend.push({"category": "cooking_time", "keywords": cookingTime});
            }

            if (servingPax !== null) {
                toSend.push({ "category": "serving_pax", "keywords": servingPax });
            }

            if (cuisine !== "") {
                toSend.push({ "category": "cuisine", "keywords": cuisine });
            }

            if (recType !== "") {
                toSend.push({ "category": "rec_type", "keywords": recType });
            }

            const onlySpaces = /^\s*$/

            var canSubmit = true;  
            
            

            if (advanceSearch === "") {
                
            } else if (onlySpaces.test(advanceSearch)) {
                setSearchErr("complex-search-empty");
                setAdvanceSearch("")
                canSubmit = false;
            } else {
                toSend.push({ "category": "recingred", "keywords": advanceSearch });
            }

            if (toSend.length > 0 && canSubmit) {
                handleClose();

                // Reset the states
                setSearch("")
                setAdvanceSearch("");
                setCookingTime(null);
                setServingPax(null);
                setCuisine("");
                setRecType("");

                // alert(JSON.stringify(toSend));
                dispatch(complex_search_recipes(toSend))
            }
        } else {
            setSearchErr("not-explore")
            // handleClose();

            // Reset the states
            setSearch("")
            setAdvanceSearch("");
            setCookingTime(null);
            setServingPax(null);
            setCuisine("");
            setRecType("");
            
        }
        


    }

    const handleSubmit = () => {
        // alert(JSON.stringify([open, search, cookingTime, servingPax, cuisine, recType]));
        // dispatch(search_recipes(search));
    };

    const getSingleSearchError = () => {
        if (searchErr === "single-search-empty") {
            return ("Error: No value keyed in!")
        }else if (searchErr === "not-explore"){
            return ("Search is unavailable here")
        } else {
            return ("");
        }
    }

    const getComplexSearchError = () => {
        if (searchErr === "single-search-empty") {
            return ("Error: No value keyed in!")
        }else if (searchErr === "not-explore"){
            return ("Search is unavailable here")
        } else {
            return ("");
        }
    }

    //console.log(JSON.stringify([open, search, cookingTime, servingPax, cuisine, recType]));
    // console.log(search);

    //console.log(location.pathname === "/explore")

    return (
        <div className={classes.root}>
            {/* <Grid container>
                <form >
                    <Grid item> */}
            {/* <InputBase
                        className={classes.input}
                        placeholder="Search Recipes"
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton> */}

            {/* label={<Typography id="search-bar-label" variant="button" display="block" component="p" gutterBottom>Search</Typography>}  */}

            <TextField id="single-search-input" style={{ padding: "0px" }}
                value={search} onChange={(e) => { setSearch(e.target.value); setAdvanceSearch(e.target.value); setSearchErr("") }}
                error={searchErr === "single-search-empty" || searchErr === "not-explore"}
                helperText={getSingleSearchError()}
                placeholder="Search" variant="outlined" color="primary" size="small"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="end" variant="filled" style={{ width: "40.86px", height: "40px", margin: "0px", padding: "0px" }}>
                        <button type="submit"
                            className="btn btn-light search-bar-btn"
                            onClick={event => { handleSingleSearch(event) }}>
                            <i className="fa fa-search"></i>
                        </button>
                    </InputAdornment>,
                }}

            />


            <Button id="advance-search-button" style={{ color: "#f7fff7", textTransform: "capitalize", font: "inherit", fontSize: "14px" }}
                onClick={(e) => handleClickOpen()}>
                Advance Search
            </Button>

            <Dialog onClose={(e) => handleClose()} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={e => handleClose()} color="primary"
                    style={{ margin: "0px" }}>
                    Advance Search
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ width: '100%' }}>
                        <Grid container spacing={2}>

                            <Grid container item xs={12} className={classes.gridRow}>
                                <TextField fullWidth label="Search" value={advanceSearch} onChange={(e) => { setAdvanceSearch(e.target.value); setSearchErr("") }}
                                    error={searchErr === "complex-search-empty" || searchErr === "not-explore"}
                                    helperText={getComplexSearchError()}
                                    placeholder="Recipe / Ingredients" variant="outlined" color="primary" size="small"
                                    InputLabelProps={{ shrink: true, }} />
                            </Grid>


                            <Grid item xs={12} >
                                <Grid container direction="row" justifyContent="flex-start" spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <FormControl className={classes.formControl} style={{ minWidth: 120, width: "100%" }}>
                                            <TextField variant="outlined" size="small" type="number"
                                                label="Cooking Time"
                                                onChange={e => setCookingTime(e.target.value)}
                                                value={cookingTime}
                                                InputLabelProps={{ shrink: true, }}
                                                InputProps={{
                                                    inputProps: { min: 0 },
                                                    endAdornment: <InputAdornment position="end">min</InputAdornment>
                                                }}>
                                            </TextField>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <FormControl className={classes.formControl} style={{ width: "100%" }}>
                                            <TextField variant="outlined" size="small" type="number"
                                                label="Serving Pax"
                                                InputLabelProps={{ shrink: true, }}
                                                onChange={e => setServingPax(e.target.value)}
                                                value={servingPax}
                                                InputProps={{
                                                    inputProps: { min: 0 },
                                                    startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>
                                                }}>
                                            </TextField>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <FormControl variant="outlined" size="small" style={{ minWidth: 120, width: "100%" }}>
                                            <InputLabel id="demo-simple-select-placeholder-label-label">
                                                Cuisine
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-placeholder-label-label"
                                                id="demo-simple-select-placeholder-label"
                                                value={cuisine}
                                                onChange={e => setCuisine(e.target.value)}
                                                label="Cuisine"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value="Chinese">Chinese</MenuItem>
                                                <MenuItem value="Western">Western</MenuItem>
                                                <MenuItem value="Japanese">Japanese</MenuItem>
                                                <MenuItem value="Korean">Korean</MenuItem>
                                                <MenuItem value="Indian">Indian</MenuItem>
                                                <MenuItem value="Thai">Thai</MenuItem>
                                                <MenuItem value="Mexican">Mexican</MenuItem>
                                                <MenuItem value="Others">Others</MenuItem>
                                            </Select>
                                            {/* <FormHelperText>Label + placeholder</FormHelperText> */}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <FormControl variant="outlined" size="small" style={{ width: "130px", width: "100%" }}>
                                            <InputLabel id="demo-simple-select-placeholder-label-label">
                                                Recipe Type
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-placeholder-label-label"
                                                id="demo-simple-select-placeholder-label"
                                                value={recType}
                                                onChange={e => setRecType(e.target.value)}
                                                label="Cuisine"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value="Breakfast">Breakfast</MenuItem>
                                                <MenuItem value="Lunch">Lunch</MenuItem>
                                                <MenuItem value="Dinner">Dinner</MenuItem>
                                                <MenuItem value="Dessert">Dessert</MenuItem>
                                                <MenuItem value="Brunch">Brunch</MenuItem>
                                                <MenuItem value="Snack">Snack</MenuItem>

                                            </Select>
                                            {/* <FormHelperText>Label + placeholder</FormHelperText> */}
                                        </FormControl>
                                    </Grid>


                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* <Typography gutterBottom>
                                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                    in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                </Typography> */}

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={e => handleComplexSearch(e)} color="primary">
                        Search
                    </Button>
                </DialogActions>
            </Dialog>



            {/* <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton> */}
            {/* </Grid>
                </form>
            </Grid> */}
        </div>
    )




}