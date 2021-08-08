import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Jumbotron, Button } from 'reactstrap';

class PublicHomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Jumbotron>
                    <h2 className="display-3 welcome"><strong>Welcome to JustNice!</strong></h2>
                    <p className="lead tab">
                        Enjoy baking or whipping up a sumptuous meal for you and your family? 
                    </p>

                    <p className="lead tab">
                        Explore new recipes on JustNice and convert your favourite recipes into grocery lists to help plan your next trip to the supermarket. 
                        Stay organised and hassle-free with all your recipes and grocery list stored on our platform. 
                    </p>
                    
                    <hr className="my-2" />
                    <p className="tab" style={{color: "#f7fff7", fontSize: "24px"}}>                  
                        <strong>Let JustNice make everything just nice for you!</strong>
                    </p>
                    
              
                    <p className="lead tab">
                        <Button id="publicpage-document" color="primary" onClick={e => window.location.href="/signup"}>
                            <strong>Sign Up Now</strong>
                        </Button>
                        {/* <Button id="publicpage-document" color="primary" onClick={e => window.open("", "_blank")}>
                            Document
                        </Button>
                    
                        <Button id="publicpage-videoposter" color="primary" onClick={e => window.open("", "_blank")}>
                            Video
                        </Button> */}
                    </p>
                </Jumbotron>
            </div>
        )
    }
}

export default PublicHomePage;