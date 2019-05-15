import React from 'react';
import './scss/style.scss';
import '../node_modules/jquery/dist/jquery.min.js'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min'

import NavigationActions from './actions/NavActions.js';
import WorkerActions from "./actions/WorkerActions";
import ManagerActions from "./actions/ManagerActions";
import UserActions from "./actions/UserActions";

function App() {
    return (
        <div className="App container-fluid">
            <div id="navigationBar">
                <nav className="navbar navbar-expand-xl navbar-dark bg-dark fixed-top">
                    <div className="container">
                        <a className="navbar-brand font-weight-bolder font-italic" style={{fontSize: 30 + 'px'}}
                           href="/">Le Shutterz</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon">
                            </span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarResponsive">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <button className="btn btn-light mr-3 font-weight-bold" onClick={() => {
                                        NavigationActions.showLoginFunction();
                                        NavigationActions.resetStoreValues();
                                    }}><i className="fa fa-user"></i> Login
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-light mr-3 font-weight-bold" onClick={() => {
                                        NavigationActions.showStartPage();
                                        UserActions.logoutUser();
                                        UserActions.resetUserValues();
                                        NavigationActions.resetStoreValues();
                                    }}><i className="fa fa-user"></i> Logout
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-light mr-3 font-weight-bold" onClick={() => {
                                        NavigationActions.showRegisterFunction();
                                        NavigationActions.resetStoreValues();
                                    }}><i className="fa fa-cog"></i> Register
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div id="mainContentPane" className="container-fluid mt-5 spacer">
                <div className="row spacer">
                    <div className="col-12 d-flex justify-content-center">
                        <p className="formLabels">Please login, or register if You haven't already!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
