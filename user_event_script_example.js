/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record'], function(record) {
    function beforeSubmit(context) {
        var newRecord = context.newRecord;
        newRecord.setValue({
            fieldId: 'memo',
            value: 'Updated by User Event Script'
        });
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
