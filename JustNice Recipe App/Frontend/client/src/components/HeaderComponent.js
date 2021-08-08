import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarText
} from 'reactstrap';

import { ButtonDropdown, UncontrolledDropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import { DropdownButton, Dropdown } from 'react-bootstrap';

import { Link, NavLink } from 'react-router-dom';

import SearchBar from "./SearchBarComponent.js";
import { baseUrl } from "../shared/baseUrl";

import Image from "material-ui-image";

import { load_profile_image, load_profile_image_reset, update_profile_image, login_edit_attempt, login_edit_reset } from "../redux/ActionCreators";
import Loading from "./LoadingComponent";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { Avatar } from '@material-ui/core';

// function DropDownMenu(props) {
//   // if (props.isProfileOpen) {
//     return (

//       <div className="profile-tab" id="profile-tab" style={{visibility:props.isProfileOpen ? "visible" : "hidden"}}>

//         <a className="profile-item">
//           <button type="button" className="profile-button">
//             <span className="icon-button"><i className="fa fa-user-circle fa-lg" /></span>
//             <span className="icon-right">Account</span>
//           </button>
//         </a>

//         <a className="profile-item">
//           <button type="button" className="profile-button"> 
//             <span className="icon-button"><i className="fa fa-cog fa-lg" /></span>
//             <span className="icon-right">Settings</span>
//           </button>
//         </a>

//         <hr className="profile-line"/>

//         <a className="profile-item" >
//           <button type="button" className="profile-button" onClick={event => props.signout(event)}> 
//             <span className="icon-button"><i className="fa fa-sign-out fa-lg" /></span>
//             <span className="icon-right">Sign Out</span>
//           </button>

//         </a>


//       </div>
//     );
//   // } else {
//   //   return (
//   //     <div></div>
//   //   );
//   // }

// }
const mapStateToProps = state => {
  return {
    login: state.login,
    images: state.images,
  }
}

const mapDispatchToProps = (dispatch) => ({

});


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavOpen: false,
      isProfileOpen: false,
      search: null
    }
    this.toggleNav = this.toggleNav.bind(this);
    this.toggleProfile = this.toggleProfile.bind(this);
    this.blurToggleNav = this.blurToggleNav.bind(this);
    this.blurToggleProfile = this.blurToggleProfile.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  toggleNav() {
    this.setState({ isNavOpen: !this.state.isNavOpen });
  }

  toggleProfile() {
    //console.log("triggered")
    this.setState({ isProfileOpen: !this.state.isProfileOpen });
  }

  blurToggleNav() {
    if (this.state.isNavOpen) {
      this.setState({ isNavOpen: !this.state.isNavOpen });
    }
  }

  blurToggleProfile(event) {
    event.preventDefault();
    //console.log('triggered')
    if (this.state.isProfileOpen) {
      this.setState({ isProfileOpen: !this.state.isProfileOpen });
    }
  }

  submitSearch(event) {
    event.preventDefault();
    this.setState({ search: null });
    //console.log("Searching for: " + this.state.search);
    // alert("Searching for: " + this.state.search);
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

  render() {
    return (
      <div>
        <Navbar dark expand="md">
          <NavbarToggler onClick={this.toggleNav} />

          <NavLink to="/explore">
            <NavbarBrand className="navbar-brand-mobile">
              <img src="/JustNiceLogo-3.png" width="30px" height="30px" />JustNice
            </NavbarBrand>
          </NavLink>

          {/* <div className="btn-group">
                  <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Action
                  </button>
                  <div className="dropdown-menu">
                    <a class="dropdown-item" href="#">Action</a>
                    <a class="dropdown-item" href="#">Another action</a>
                    <a class="dropdown-item" href="#">Something else here</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#">Separated link</a>
                  </div>
                </div> */}



          {/* <DropdownButton className="btn btn-primary btn-circle btn-sm" id="dropdown-basic-button">
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                  <DropDownMenu isOpen={this.state.isProfileOpen}/>
                </DropdownButton> */}

          {/* <DropdownButton type="button" className="btn btn-primary btn-circle btn-sm dropdown-toggle" isOpen={this.state.isProfileOpen} toggle={this.toggleProfile}>
                  <DropdownToggle>
                  </DropdownToggle>
                  <DropdownMenu>
                      <DropdownItem>Account</DropdownItem>
                      <DropdownItem>Settings</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={this.props.signout}>Sign Out</DropdownItem>
                  </DropdownMenu>
                </DropdownButton> */}


          {/* <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown
                  </button>

                  <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown link
                  </a>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                    <a className="dropdown-item" >Action</a>
                    <a className="dropdown-item" >Another action</a>
                    <a className="dropdown-item">Something else here</a>
                  </div>
                </div> */}





          {/* <div className="profile-icon" > */}
          {/* <Dropdown className="profile-icon" isOpen={this.state.isProfileOpen} toggle={this.toggleProfile}>
                        <DropdownToggle className="btn-circle btn-md">
                        Hz</DropdownToggle>
                        
                        <DropdownMenu>
                            <DropdownItem header>Profile</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Account</DropdownItem>
                            <DropdownItem>Settings</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={this.props.signout}>Sign Out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown> */}


          {/* <button className="btn btn-primary btn-circle btn-md" onClick={this.toggleProfile} 
                    onBlur={event => this.toggleProfile(event)}>HZ</button>

                    <DropDownMenu isProfileOpen={this.state.isProfileOpen} 
                                        signout={this.props.signout}/> */}

          {/* </div> */}




          <Collapse isOpen={this.state.isNavOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem className="nav-item">
                <NavLink className="nav-link" to="/explore">Explore</NavLink>
              </NavItem>

              <NavItem>
                <NavLink className="nav-link" to="/myrecipes/" >My Recipe</NavLink>
              </NavItem>

              <NavItem>
                <NavLink className="nav-link" to="/grocerylist" >Grocery List</NavLink>
              </NavItem>

              <div className="search-bar">
                <SearchBar />
              </div>


              {/* <form className="search-bar">
                      <div className="form-horizontal">
                      <div className="input-group">
                        <input type="text" name="..." 
                          className="form-control" 
                          placeholder="Search" 
                          onChange={(event) => this.setState({search: event.target.value})}
                              />
                        
                        <span className="input-group-btn">
                          <button type="submit" 
                                className="btn btn-light search-bar-btn"
                                onClick={event => {this.submitSearch(event)}}>
                              <i className="fa fa-search"></i>
                          </button>
                        </span>
                          

                      </div>
                        
                      </div>
                    </form> */}



              {/* <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        Options
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          Option 1
                        </DropdownItem>
                        <DropdownItem>
                          Option 2
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>
                          Reset
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown> */}
            </Nav>

          </Collapse>

          <Dropdown className="profile-icon">
            <Dropdown.Toggle className="btn profile-border" variant="light" id="dropdown-basic" style={{
              borderColor: "rgba(0, 0, 0, 0.30)", borderWidth: "medium", backgroundColor: "#FFFFFF", padding: "0px"
            }} >
              {/* <Image src={(this.props.images.profile.inProgress === "success") ? `${baseUrl}${this.props.images.profile.url}` : ""}
                        aspectRatio={(1 / 1)} /> */}
              <Avatar width="100%" src={(this.props.images.profile.inProgress === "success") ? `${baseUrl}${this.props.images.profile.url}?${this.getCurrentDate()}` : ""}
                style={{ borderColor: "rgba(0, 0, 0, 0.30)" }}
              />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/account"><i className="fa fa-user-circle fa-lg icon-button" />Account</Dropdown.Item>
              <Dropdown.Item href="#/action-2"><i className="fa fa-cog fa-lg icon-button" />Settings</Dropdown.Item>
              <DropdownItem divider />
              <Dropdown.Item onClick={this.props.signout}><i className="fa fa-sign-out fa-lg icon-button" />Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>




        </Navbar>



      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));