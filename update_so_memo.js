function updateSalesOrderMemo(soId) {
    var record = nlapiLoadRecord('salesorder', soId);
    record.setFieldValue('memo', 'Memo updated via script');
    var id = nlapiSubmitRecord(record);
    nlapiLogExecution('AUDIT', 'Sales Order Updated', 'ID: ' + id);
}
