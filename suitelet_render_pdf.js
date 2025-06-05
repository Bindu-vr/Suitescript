/**
 * @NApiVersion 1.0
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
function generatePDF(request, response) {
    var xml = '';
    xml += '<?xml version="1.0"?>';
    xml += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
    xml += '<pdf>';
    xml += '<head><title>Sample PDF</title></head>';
    xml += '<body font-size="12">';
    xml += '<h1 align="center">Invoice Summary</h1>';
    xml += '<table border="1" width="100%">';
    xml += '<tr><th>Item</th><th>Qty</th><th>Price</th></tr>';
    xml += '<tr><td>Widget A</td><td>2</td><td>$20.00</td></tr>';
    xml += '<tr><td>Widget B</td><td>5</td><td>$10.00</td></tr>';
    xml += '</table>';
    xml += '<p align="right">Total: $90.00</p>';
    xml += '</body></pdf>';

    var pdfFile = nlapiXMLToPDF(xml);
    pdfFile.setName('Invoice_Summary.pdf');

    response.setContentType('PDF', 'Invoice_Summary.pdf', 'inline');
    response.write(pdfFile.getValue());
}
