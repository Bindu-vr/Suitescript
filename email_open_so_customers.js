function emailOpenSO() {
    var filters = [new nlobjSearchFilter('status', null, 'anyof', ['SalesOrd:A'])];
    var columns = [
        new nlobjSearchColumn('tranid'),
        new nlobjSearchColumn('entity'),
        new nlobjSearchColumn('email', 'customer')
    ];

    var results = nlapiSearchRecord('salesorder', null, filters, columns);

    if (results) {
        for (var i = 0; i < results.length; i++) {
            var soNum = results[i].getValue('tranid');
            var email = results[i].getValue('email', 'customer');
            var customer = results[i].getText('entity');

            if (email) {
                nlapiSendEmail(nlapiGetUser(), email, 'Reminder for Sales Order #' + soNum,
                    'Dear ' + customer + ',\n\nThis is a reminder for your open Sales Order #' + soNum);
                nlapiLogExecution('AUDIT', 'Email Sent', 'To: ' + email);
            }
        }
    }
}
