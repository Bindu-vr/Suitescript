function updateMemoInPO(recType, recId) {
    var po = nlapiLoadRecord(recType, recId);
    po.setFieldValue('memo', 'Updated via Mass Update Script');
    nlapiSubmitRecord(po);
}
