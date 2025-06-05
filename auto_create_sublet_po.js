function afterSubmit_so_to_po(type) {
    if (type !== 'create') return;

    var so = nlapiLoadRecord('salesorder', nlapiGetRecordId());
    var vendorId = 123; // Change to your Sublet Vendor internal ID

    var po = nlapiCreateRecord('purchaseorder');
    po.setFieldValue('entity', vendorId);
    po.setFieldValue('custbody_sublet_from_so', so.getId());

    var lineCount = so.getLineItemCount('item');
    for (var i = 1; i <= lineCount; i++) {
        var item = so.getLineItemValue('item', 'item', i);
        var quantity = so.getLineItemValue('item', 'quantity', i);

        po.selectNewLineItem('item');
        po.setCurrentLineItemValue('item', 'item', item);
        po.setCurrentLineItemValue('item', 'quantity', quantity);
        po.commitLineItem('item');
    }

    var poId = nlapiSubmitRecord(po, true);
    nlapiLogExecution('AUDIT', 'Sublet PO Created', 'PO ID: ' + poId);
}
