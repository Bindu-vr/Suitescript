function createSalesOrderSearch() {
    var filters = [
        new nlobjSearchFilter('status', null, 'anyof', ['SalesOrd:A']) // Open Sales Orders
    ];

    var columns = [
        new nlobjSearchColumn('tranid'),       // Document Number
        new nlobjSearchColumn('entity'),       // Customer
        new nlobjSearchColumn('trandate'),     // Date
        new nlobjSearchColumn('status'),       // Status
        new nlobjSearchColumn('amount')        // Amount
    ];

    var results = nlapiSearchRecord('salesorder', null, filters, columns);

    if (results && results.length > 0) {
        for (var i = 0; i < results.length; i++) {
            var soNum = results[i].getValue('tranid');
            var customer = results[i].getText('entity');
            nlapiLogExecution('DEBUG', 'Sales Order #' + soNum, 'Customer: ' + customer);
        }
    } else {
        nlapiLogExecution('DEBUG', 'No open sales orders found');
    }
}
