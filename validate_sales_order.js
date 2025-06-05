function validateField(type, name, linenum) {
    if (name === 'entity') {
        var customer = nlapiGetFieldValue('entity');
        if (!customer) {
            alert('Customer must be selected before saving!');
            return false;
        }
    }
    return true;
}
