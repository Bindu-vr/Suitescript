function getCustomerEmail(customerId) {
    var email = nlapiLookupField('customer', customerId, 'email');
    nlapiLogExecution('DEBUG', 'Customer Email', email);
    return email;
}
