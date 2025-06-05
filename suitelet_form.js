/**
 * @NApiVersion 1.0
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
function suiteletForm(request, response) {
    if (request.getMethod() === 'GET') {
        var form = nlapiCreateForm('Custom Customer Entry Form');

        // Add Tabs
        form.addTab('custpage_main_tab', 'Main Info');
        form.addTab('custpage_sublist_tab', 'Items List');

        // Add Fields on Main Tab
        form.addField('custpage_customer_name', 'text', 'Customer Name', null, 'custpage_main_tab')
            .setMandatory(true);
        form.addField('custpage_email', 'email', 'Email', null, 'custpage_main_tab');

        // Add Sublist
        var sublist = form.addSubList('custpage_items_sublist', 'list', 'Items', 'custpage_sublist_tab');
        sublist.addField('custpage_item_name', 'text', 'Item Name');
        sublist.addField('custpage_item_qty', 'integer', 'Quantity');
        sublist.addField('custpage_item_price', 'currency', 'Price');

        // Dummy Data
        for (var i = 0; i < 3; i++) {
            sublist.setLineItemValue('custpage_item_name', i + 1, 'Item ' + (i + 1));
            sublist.setLineItemValue('custpage_item_qty', i + 1, (i + 1) * 2);
            sublist.setLineItemValue('custpage_item_price', i + 1, (i + 1) * 10);
        }

        form.addSubmitButton('Submit');
        response.writePage(form);
    } else {
        var name = request.getParameter('custpage_customer_name');
        var email = request.getParameter('custpage_email');

        nlapiLogExecution('AUDIT', 'Form Submitted', 'Name: ' + name + ', Email: ' + email);
        response.write('Form submitted successfully!');
    }
}
