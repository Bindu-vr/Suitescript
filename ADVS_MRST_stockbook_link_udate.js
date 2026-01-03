/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/search','N/record','N/log'], (search, record, log) => {

    const getInputData = () => {
        return search.create({
            type: 'customrecord_advs_service_history_legacy',
            filters: [
                ['custrecord_advs_21','isnotempty','']
            ],
            columns: [
                'internalid',
                'custrecord_advs_21'
            ]
        });
    };

    const map = (context) => {
        var data = JSON.parse(context.value);

        var legacyRecId = data.id;
        var stockBookName = data.values.custrecord_advs_21;

        if (!stockBookName) return;

        var stockBookId = getStockBookId(stockBookName);

        if (!stockBookId) return;

        record.submitFields({
            type: 'customrecord_advs_service_history_legacy',
            id: legacyRecId,
            values: {
                custrecord340: stockBookId
            },
            options: {
                enableSourcing: true,
                ignoreMandatoryFields: true
            }
        });
    };

    const reduce = () => {};

    const summarize = (summary) => {
        summary.mapSummary.errors.iterator().each((key, error) => {
            log.error('Map Error ' + key, error);
            return true;
        });
    };

    function getStockBookId(stockBookName) {

        var sbSearch = search.create({
            type: 'customrecord_stock_book',
            filters: [
                ['name','is',stockBookName]
            ],
            columns: ['internalid']
        });

        var result = sbSearch.run().getRange({ start: 0, end: 1 });

        return result.length ? result[0].getValue('internalid') : null;
    }

    return {
        getInputData,
        map,
        reduce,
        summarize
    };
});
