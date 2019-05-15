import {EventEmitter} from 'events'

class MainStore extends EventEmitter {

    _nameToReloadCustomerOrdersWith = '';
    _queriedOrders = null;
    _queriedOrderElements = null;
    _queriedShutterModels = null;
    _queriedInvoiceData = null;
    _queriedInvoiceElements = null;
    _statistics = null;
    _loggedInUser = null;
    _loggedIn = false;

    emitChange() {
        this.emit('change')
    }

    addChangeListener(callback) {
        this.on('change', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('change', callback);
    }

} 

export default new MainStore();