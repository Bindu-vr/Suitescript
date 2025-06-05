function beforeSubmitInventoryTransfer(type) {
    if (type !== 'create') return;

    var itemCount = nlapiGetLineItemCount('inventory');
    for (var i = 1; i <= itemCount; i++) {
        var item = nlapiGetLineItemValue('inventory', 'item', i);
        var qty = nlapiGetLineItemValue('inventory', 'adjustqtyby', i);

        nlapiLogExecution('DEBUG', 'Transferring Item', 'Item: ' + item + ', Qty: ' + qty);
    }
}
