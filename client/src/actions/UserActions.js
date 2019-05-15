import ShutterDispatcher from '../dispatcher/ShutterDispatcher';
import UserConstants from '../constants/userConstants';

class UserActions {
    loginUser(username, password) {
        ShutterDispatcher.handleViewAction({
            actionType: UserConstants.LOGIN,
            payload: {
                username: username, 
                password: password
            }
        });
    }
    
    logoutUser(){
        ShutterDispatcher.handleViewAction({
            actionType: UserConstants.LOGOUT,
            payload: null
        });
    }

    resetUserValues() {
        ShutterDispatcher.handleViewAction({
            actionType: UserConstants.RESET_USER_VALUES,
            payload: null
        });
    }
    
    registerUser(user) {
        ShutterDispatcher.handleViewAction({
            actionType: UserConstants.REGISTER,
            payload: user
        });
    }
}

export default new UserActions();