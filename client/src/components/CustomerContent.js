import React from 'react';

import CreateOrderFrom from './CreateOrderForm';
import ListMyOrdersForm from './ListOwnOrderForm';

class CustomerContent extends React.Component {

    render() {
        return (
            <div className="row mt-5">
                <div className="col-12 d-flex justify-content-center">
                    <CreateOrderFrom/>
                </div>
                <div className="container-fluid spacer">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                            <ListMyOrdersForm/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CustomerContent;