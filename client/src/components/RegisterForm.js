import React from 'react';
import UserActions from "../actions/UserActions";
import NavigationActions from "../actions/NavActions"
import MainStore from "../stores/MainStore";

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                "name": "",
                "email": "",
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
                                <div className="col-5"><label className="formLabels">Name:</label></div>
                                <div className="col-7">
                                    <input
                                        onChange={(event) => {
                                            let newUser = this.state.user;
                                            newUser.name = event.target.value;
                                            this.setState({user: newUser});
                                        }}
                                        type="text" required="required" placeholder="name" className="form-control-lg"/>
                                </div>
                            </div>

                            <div className="row form-group">
                                <div className="col-5"><label className="formLabels">E-mail:</label></div>
                                <div className="col-7">
                                    <input
                                        onChange={(event) => {
                                            let newUser = this.state.user;
                                            newUser.email = event.target.value;
                                            this.setState({user: newUser});
                                        }}
                                        type="text" required="required" placeholder="e-mail" className="form-control-lg"/>
                                </div>
                            </div>
                            
                            <div className="row form-group">
                                <div className="col-5"><label className="formLabels">Username:</label></div>
                                <div className="col-7">
                                    <input
                                        onChange={(event) => {
                                            let newUser = this.state.user;
                                            newUser.username = event.target.value;
                                            this.setState({user: newUser});
                                        }}
                                        type="text" required="required" placeholder="username" className="form-control-lg"/>
                                </div>
                            </div>

                            <div className="row form-group">
                                <div className="col-5"><label className="formLabels">Password:</label></div>
                                <div className="col-7">
                                    <input
                                        onChange={(event) => {
                                            let newUser = this.state.user;
                                            newUser.password = event.target.value;
                                            this.setState({user: newUser});
                                        }}
                                        type="text" required="required" placeholder="password" className="form-control-lg"/>
                                </div>
                            </div>

                            <div className="row form-group mt-3">
                                <div className="col-12 d-flex justify-content-center">
                                    <button data-toggle="modal" data-target="#doneModal"
                                            onClick={() => {
                                                UserActions.registerUser(this.state.user);
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
                                <p>Successful registration!</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => {
                                    NavigationActions.showLoginFunction();
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

export default RegisterForm;