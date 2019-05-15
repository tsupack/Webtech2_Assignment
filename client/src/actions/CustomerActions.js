import ShutterDispatcher from '../dispatcher/ShutterDispatcher';
import CustomerConstants from '../constants/customerConstants';

class CustomerActions {
    createOrder(order) {
        ShutterDispatcher.handleViewAction({
            actionType: CustomerConstants.CREATE_ORDER,
            payload: order
        });
    }

    createElement(element) {
        ShutterDispatcher.handleViewAction({
            actionType: CustomerConstants.CREATE_ELEMENT,
            payload: element
        });
    }

    listMyOrders(name) {
        ShutterDispatcher.handleViewAction({
            actionType: CustomerConstants.LIST_MY_ORDERS,
            payload: name
        })
    }

    listMyOrderElements(orderID) {
        ShutterDispatcher.handleViewAction({
            actionType: CustomerConstants.LIST_MY_ORDER_ELEMENTS,
            payload: orderID
        })
    }

    listShutterModels() {
        ShutterDispatcher.handleViewAction({
            actionType: CustomerConstants.LIST_SHUTTER_MODELS,
            payload: null
        })
    }

    payOrder(orderID){
        ShutterDispatcher.handleViewAction({
           actionType: CustomerConstants.PAY_ORDER,
           payload: orderID
        });
    }
}

export default new CustomerActions();