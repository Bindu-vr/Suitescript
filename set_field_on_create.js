function userEventBeforeLoad(type, form, request) {
    if (type === 'create') {
        nlapiSetFieldValue('memo', 'Auto-filled on create');
    }
}
