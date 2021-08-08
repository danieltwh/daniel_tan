import React, {Component} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavbarText
  } from 'reactstrap';

  import { Button, UncontrolledDropdown, DropdownItem,DropdownToggle, DropdownMenu} from 'reactstrap';

  import { Link, NavLink } from 'react-router-dom';

class PublicHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false,
            isProfileOpen: false
        }
        this.toggleNav = this.toggleNav.bind(this);
        // this.toggleProfile = this.toggleProfile.bind(this);
    }

    toggleNav() {
        this.setState({isNavOpen:!this.state.isNavOpen});
    }

    // toggleProfile() {
    //     this.setState({isProfileOpen: !this.state.isProfileOpen});
    // }

    render() {
        return (
            <div>
              <Navbar dark expand="md">
                <NavbarToggler onClick={this.toggleNav} onBlur={this.toggleNav}/>
                
                <NavLink to="/home">
                  <NavbarBrand className="navbar-brand-mobile">
                    <img src="/JustNiceLogo-3.png" width="30px" height="30px" />JustNice
                  </NavbarBrand>
                </NavLink>
                
                
                {/* <div className="public-signup-login">
                  <div className="container-fluid">
                    <div className="row"></div>
                      <div className="col-10"><NavLink to="/signup"><Button color="info">Sign Up</Button></NavLink></div>
                      <div className="col-2"><NavLink to="/login"><Button color="success">Login</Button></NavLink></div>
                  </div>
                </div> */}
                {/* <div>
                    <NavLink to="/login"><Button>Login</Button></NavLink>
                </div> */}
                <Collapse isOpen={this.state.isNavOpen} navbar>
                  <Nav className="mr-auto" navbar>
                    <NavItem>
                      <NavLink className="nav-link" to="/home">Home</NavLink>
                    </NavItem>

                    {/* <NavItem>
                      <NavLink className="nav-link" to="/aboutus">About Us</NavLink>
                    </NavItem> */}

                    {/* <NavItem>
                      <NavLink className="nav-link" to="/myrecipes/" >My Recipe</NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink className="nav-link" to="/grocerylist" >Grocery List</NavLink>
                    </NavItem> */}
                    
                  </Nav>
                  <div className="public-signup-login">
                      <div className="public-signup"><NavLink to="/signup"><Button className="border-light" color="info" >Sign Up</Button></NavLink></div>
                      <div className="public-login ml-2"><NavLink to="/login"><Button className="border-light" color="success">Login</Button></NavLink></div>
                  </div>
                  
                </Collapse>
                


                
              </Navbar>
              
            </div>
          );
    }
}
  
export default PublicHeader;