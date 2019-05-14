import React from 'react';
import ListNotInstalledOrders from "./ListNotInstalledOrders";
import ListInstalledOrders from "./ListInstalledOrders";
import ListStatistics from "./ListStatistics";
import CreateInvoice from "./CreateInvoice";

class ManagerContent extends React.Component {

    render() {
        return (
            <div>
                <div className="row mt-5">
                    <div className="col-6 d-flex justify-content-center">
                        <CreateInvoice/>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12 d-flex justify-content-center">
                        <ListNotInstalledOrders/>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-12 d-flex justify-content-center">
                        <ListInstalledOrders/>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-12 d-flex justify-content-center">
                        <ListStatistics/>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManagerContent;