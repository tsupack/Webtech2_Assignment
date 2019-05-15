import ShutterDispatcher from '../dispatcher/ShutterDispatcher';
import NavigationConstants from '../constants/navigationConstants.js';


class NavActions {
    showStartPage() {
        ShutterDispatcher.handleViewAction({
            actionType: NavigationConstants.SHOW_START_PAGE,
            payload: null
        });
    }
    
    showLoginFunction() {
        ShutterDispatcher.handleViewAction({
            actionType: NavigationConstants.LOAD_LOGIN_CONTENT,
            payload: null
        });
    }

    showRegisterFunction() {
        ShutterDispatcher.handleViewAction({
            actionType: NavigationConstants.LOAD_REGISTER_CONTENT,
            payload: null
        });
    }

    showCustomerFunctions() {
        ShutterDispatcher.handleViewAction({
            actionType: NavigationConstants.LOAD_CUSTOMER_CONTENT,
            payload: null
        });
    }

    showWorkerFunctions() {
        ShutterDispatcher.handleViewAction({
            actionType: NavigationConstants.LOAD_WORKER_CONTENT,
            payload: null
        });
    }

    showManagerFunctions() {
        ShutterDispatcher.handleViewAction({
            actionType: NavigationConstants.LOAD_MANAGER_CONTENT,
            payload: null
        });
    }

    resetStoreValues() {
        ShutterDispatcher.handleViewAction({
            actionType: NavigationConstants.RESET_STORE_VALUES,
            payload: null
        });
    }
}

export default new NavActions();