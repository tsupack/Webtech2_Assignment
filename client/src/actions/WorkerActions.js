import ShutterDispatcher from '../dispatcher/ShutterDispatcher.js';
import WorkerConstants from '../constants/workerConstants.js';

class WorkerActions {

    listNotAssembledOrders() {
        ShutterDispatcher.handleViewAction({
            actionType: WorkerConstants.LIST_NOT_ASSEMBLED_ORDERS,
            payload: null
        });
    }

    listOrderElements(orderID) {
        ShutterDispatcher.handleViewAction({
            actionType: WorkerConstants.LIST_ORDER_ELEMENTS,
            payload: orderID
        });
    }

    assembleOrder(orderID) {
        ShutterDispatcher.handleViewAction({
            actionType: WorkerConstants.ASSEMBLE_ORDER,
            payload: {orderID: orderID}
        });
    }

}

export default new WorkerActions();