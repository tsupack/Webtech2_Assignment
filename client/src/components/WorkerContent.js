import React from 'react';

import ListNotAssembledOrders from "./ListNotAssembledOrders.js";

class CustomerContent extends React.Component{

    render() {
        return(
            <div className="row mt-5">
                <div className="col-md-1"/>
                    <div className="col-md-10">
                        <ListNotAssembledOrders/>
                    </div>
                <div className="col-md-1"/>
            </div>
        );
    }
}

export default CustomerContent;