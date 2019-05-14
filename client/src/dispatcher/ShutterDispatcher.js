import {Dispatcher} from 'flux'
import React from 'react'
import ReactDOM from 'react-dom'

import UserConstants from '../constants/userConstants'
import NavigationConstants from '../constants/navigationConstants';
import CustomerConstants from '../constants/customerConstants';
import WorkerConstants from '../constants/workerConstants';
import ManagerConstants from '../constants/managerConstants';
import CustomerContent from '../components/CustomerContent.js';
import WorkerContent from '../components/WorkerContent.js';
import ManagerContent from '../components/ManagerContent.js';
import LoginContent from '../components/LoginContent.js';
import RegisterContent from '../components/RegisterContent.js';
import MainStore from "../stores/MainStore";
import ManagerActions from "../actions/ManagerActions";
import CustomerActions from "../actions/CustomerActions";

class shutterDispatcher extends Dispatcher {

    handleViewAction(action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            payload: action
        });
    }
}

const dispatcher = new shutterDispatcher();

dispatcher.register((data) => {
    if (data.payload.actionType !== UserConstants.LOGIN) {
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then((response) => {
            return response.json()
        })
        .then((userData) => {
            MainStore._loggedInUser = userData;
            MainStore.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== UserConstants.LOGOUT) {
        return;
    }
    
    ReactDOM.render(
        React.createElement(LoginContent),
        document.getElementById("mainContentPane")
    );

    fetch(`/logout`)
        .then((response) => {
            return response.status;
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== UserConstants.REGISTER) {
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then((response) => {
            return response.status;
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== NavigationConstants.LOAD_LOGIN_CONTENT) {
        return;
    }
    ReactDOM.render(
        React.createElement(LoginContent),
        document.getElementById("mainContentPane")
    );
});

dispatcher.register((data) => {
    if (data.payload.actionType !== NavigationConstants.LOAD_REGISTER_CONTENT) {
        return;
    }
    ReactDOM.render(
        React.createElement(RegisterContent),
        document.getElementById("mainContentPane")
    );
});

dispatcher.register((data) => {
    if (data.payload.actionType !== NavigationConstants.LOAD_CUSTOMER_CONTENT) {
        return;
    }
    ReactDOM.render(
        React.createElement(CustomerContent),
        document.getElementById("mainContentPane")
    );
});

dispatcher.register((data) => {
    if (data.payload.actionType !== NavigationConstants.LOAD_WORKER_CONTENT) {
        return;
    }
    ReactDOM.render(
        React.createElement(WorkerContent),
        document.getElementById("mainContentPane")
    );
});

dispatcher.register((data) => {
    if (data.payload.actionType !== NavigationConstants.LOAD_MANAGER_CONTENT) {
        return;
    }
    ReactDOM.render(
        React.createElement(ManagerContent),
        document.getElementById("mainContentPane")
    );
});

dispatcher.register((data) => {
    if (data.payload.actionType !== CustomerConstants.CREATE_ORDER) {
        return;
    }

    fetch('/createOrder', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then(() => {
            CustomerActions.listMyOrders(MainStore._nameToReloadCustomerOrdersWith);
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== CustomerConstants.LIST_MY_ORDERS) {
        return;
    }

    fetch(`/listMyOrders?name=${encodeURIComponent(data.payload.payload)}`)
        .then((response) => {
            return response.json()
        })
        .then((orders) => {
            MainStore._queriedOrders = orders;
            MainStore.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== CustomerConstants.LIST_MY_ORDER_ELEMENTS) {
        return;
    }

    fetch(`/listOrderElements?orderID=${encodeURIComponent(data.payload.payload)}`)
        .then((response) => {
            return response.json()
        })
        .then((elements) => {
            MainStore._queriedOrderElements = elements;
            MainStore.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== CustomerConstants.LIST_SHUTTER_MODELS) {
        return;
    }

    fetch(`/listShutterModels`)
        .then((response) => {
            return response.json()
        })
        .then((shutters) => {
            MainStore._queriedShutterModels = shutters;
            MainStore.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== CustomerConstants.PAY_ORDER) {
        return;
    }

    fetch('/payOrder', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then(() => {
            CustomerActions.listMyOrders(MainStore._nameToReloadCustomerOrdersWith);
        })
        .then(() => {
            MainStore.emitChange();
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== WorkerConstants.LIST_NOT_ASSEMBLED_ORDERS) {
        return;
    }

    fetch('/listNotAssembledOrders')
        .then((response) => {
            return response.json()
        })
        .then((orders) => {
            MainStore._queriedOrders = orders;
            MainStore.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== WorkerConstants.LIST_ORDER_ELEMENTS) {
        return;
    }

    fetch(`/listOrderElements?orderID=${encodeURIComponent(data.payload.payload)}`)
        .then((response) => {
            return response.json()
        })
        .then((elements) => {
            MainStore._queriedOrderElements = elements;
            MainStore.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== WorkerConstants.ASSEMBLE_ORDER) {
        return;
    }

    fetch('/assembleOrder', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then((parts) => {
            deleteObjectByKey(MainStore._queriedOrders, 'orderID', data.payload.payload.orderID);
        })
        .then(() => {
            MainStore.emitChange();
        })

});

dispatcher.register((data) => {
    if (data.payload.actionType !== ManagerConstants.LIST_NOT_INSTALLED_ORDERS) {
        return;
    }

    fetch('/listNotInstalledOrders')
        .then((response) => {
            return response.json()
        })
        .then((orders) => {
            MainStore._queriedOrders = orders;
            MainStore.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== ManagerConstants.LIST_INSTALLED_ORDERSI) {
        return;
    }

    fetch('/listInstalledOrders')
        .then((response) => {
            return response.json()
        })
        .then((orders) => {
            MainStore._queriedCompletedOrders = orders;
            MainStore.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== ManagerConstants.CREATE_INVOICE) {
        return;
    }

    fetch(`/createInvoice?orderID=${encodeURIComponent(data.payload.payload)}`)
        .then((response) => {
            return response.json()
        })
        .then((invoiceData) => {
            MainStore._queriedInvoceData = invoiceData;
            MainStore.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== ManagerConstants.CREATE_INVOICE_ELEMENTS) {
        return;
    }

    fetch(`/listOrderElements?orderID=${encodeURIComponent(data.payload.payload)}`)
        .then((response) => {
            return response.json()
        })
        .then((invoiceElements) => {
            MainStore._queriedInvoiceElements = invoiceElements;
            MainStore.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== ManagerConstants.LIST_STATISTICS) {
        return;
    }

    fetch('/listStatistics')
        .then((response) => {
            return response.json()
        })
        .then((stats) => {
            MainStore._statistics = stats;
            MainStore.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== ManagerConstants.INSTALL_ORDER) {
        return;
    }

    fetch('/installOrder', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then(() => {
            ManagerActions.listInstalledOrders();
        })
        .then(() => {
            MainStore.emitChange();
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== NavigationConstants.RESET_STORE_VALUES) {
        return;
    }

    MainStore._nameToReloadCustomerOrdersWith = '';
    MainStore._queriedOrders = null;
    MainStore._queriedOrderElements = null;
    MainStore._queriedShutterModels = null;
    MainStore._queriedInvoceData = null;
    MainStore._queriedInvoiceElements = null;
    MainStore._statistics = null;

});

//for searching the actual order
function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

//to delete actual order when needed
function deleteObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            delete array[i];
        }
    }
}

export default dispatcher;
