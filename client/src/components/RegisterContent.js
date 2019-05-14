import React from 'react';

import RegisterForm from './RegisterForm';

class RegisterContent extends React.Component {
    render() {
        return (
            <div className="row mt-5">
                <div className="col-12 d-flex justify-content-center">
                    <RegisterForm/>
                </div>
            </div>
        );
    }
}

export default RegisterContent;