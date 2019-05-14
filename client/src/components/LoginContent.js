import React from 'react';

import LoginForm from './LoginForm';

class LoginContent extends React.Component {
    render() {
        return (
            <div className="row mt-5">
                <div className="col-12 d-flex justify-content-center">
                    <LoginForm/>
                </div>
            </div>
        );
    }
}

export default LoginContent;