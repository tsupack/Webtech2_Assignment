import React from 'react';
import UserActions from "../actions/UserActions";
import NavigationActions from "../actions/NavActions"
import MainStore from "../stores/MainStore";

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {
                "username": "",
                "password": ""
            }
        };
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="row card form-group">
                        <div className="card-header text-center">
                            <label htmlFor="name" className="formLabels cardHeaderTexts">
                                Login</label>
                        </div>
                        <div className="card-body">
                            <div className="row form-group">
                                <div className="col-5"><label className="formLabels">Username:</label></div>
                                <div className="col-7">
                                    <input
                                        onChange={(event) => {
                                            let newUserInfo = this.state.userInfo;
                                            newUserInfo.username = event.target.value;
                                            this.setState({userInfo: newUserInfo});
                                        }}
                                        type="text" required="required" placeholder="username" className="form-control-lg"/>
                                </div>
                            </div>

                            <div className="row form-group">
                                <div className="col-5"><label className="formLabels">Password:</label></div>
                                <div className="col-7">
                                    <input
                                        onChange={(event) => {
                                            let newUserInfo = this.state.userInfo;
                                            newUserInfo.password = event.target.value;
                                            this.setState({userInfo: newUserInfo});
                                        }}
                                        type="text" required="required" placeholder="password" className="form-control-lg"/>
                                </div>
                            </div>
                            <div className="row form-group mt-3">
                                <div className="col-12 d-flex justify-content-center">
                                    <button data-toggle="modal" data-target="#doneModal"
                                            onClick={() => {
                                                UserActions.loginUser(this.state.userInfo.username,this.state.userInfo.password);
                                                //TODO should drop model by _loggedIn state.
                                                
                                            }}
                                            className="btn btn-success form-control">
                                        Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="doneModal" tabIndex="-1" role="dialog" aria-labelledby="doneModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <p>Successful login!</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => {
                                        if(MainStore._loggedInUser.rank === "customer"){
                                            NavigationActions.showCustomerFunctions();
                                            NavigationActions.resetStoreValues();
                                        } else if(MainStore._loggedInUser.rank === "worker"){
                                            NavigationActions.showWorkerFunctions();
                                            NavigationActions.resetStoreValues();
                                        } else if(MainStore._loggedInUser.rank === "manager"){
                                            NavigationActions.showManagerFunctions();
                                            NavigationActions.resetStoreValues();
                                        }
                                    }}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginForm;