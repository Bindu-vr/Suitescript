function sendNotificationEmail(customerId, subject, message) {
    var recipientEmail = nlapiLookupField('customer', customerId, 'email');

    if (recipientEmail) {
        nlapiSendEmail(
            nlapiGetUser(),      // sender
            recipientEmail,      // recipient
            subject,             // subject
            message              // body
        );
        nlapiLogExecution('AUDIT', 'Email Sent', 'To: ' + recipientEmail);
    } else {
        nlapiLogExecution('ERROR', 'Email Not Sent', 'No email found for customer');
    }
}
