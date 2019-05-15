import ShutterDispatcher from "../dispatcher/ShutterDispatcher";
import ManagerConstants from "../constants/managerConstants.js";

class ManagerActions {
    listNotInstalledOrders() {
        ShutterDispatcher.handleViewAction({
            actionType: ManagerConstants.LIST_NOT_INSTALLED_ORDERS,
            payload: null
        });
    }

    listInstalledOrders() {
        ShutterDispatcher.handleViewAction({
            actionType: ManagerConstants.LIST_INSTALLED_ORDERS,
            payload: null
        });
    }

    listStatistics() {
        ShutterDispatcher.handleViewAction({
            actionType: ManagerConstants.LIST_STATISTICS,
            payload: null
        });
    }

    installOrder(orderID) {
        ShutterDispatcher.handleViewAction({
            actionType: ManagerConstants.INSTALL_ORDER,
            payload: orderID
        });
    }

    createInvoice(orderID) {
        ShutterDispatcher.handleViewAction({
            actionType: ManagerConstants.CREATE_INVOICE,
            payload: orderID
        });
    }

    createInvoiceElements(orderID) {
        ShutterDispatcher.handleViewAction({
            actionType: ManagerConstants.CREATE_INVOICE_ELEMENTS,
            payload: orderID
        });
    }
}

export default new ManagerActions();