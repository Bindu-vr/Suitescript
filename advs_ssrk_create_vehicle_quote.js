/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       26 sep 2024     Rekha
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

function suitelet(request, response) {
	try {
		if (request.getMethod() == 'GET') {

			var Record_Id = request.getParameter('custparam_order_id');
			var Record_Type = request.getParameter('custparam_order_type');
			var screen_type = request.getParameter('custparam_typee');
			var OrderType = request.getParameter('OrderType');
			var OrderTypeValue = request.getParameter('custpara_ordervalue');
			nlapiLogExecution("debug", "screen_type_23", screen_type +"Record_Type" +Record_Type)

			if(screen_type == "view"){
				if(Record_Type == 'salesorder'){
					var form = nlapiCreateForm('Copy Vehicle Sales Order/Create Vehicle Sales Quote', false);
					var MAkeCoyFld = form.addField('custpage_advs_makecopi', 'select', 'Select Order/Quote', null, '');
					MAkeCoyFld.addSelectOption("","");
					MAkeCoyFld.addSelectOption("1","Copy Sales Order");
					MAkeCoyFld.addSelectOption("2","Create Sales Quote");

				}else{
					if(Record_Type == 'estimate'){
						var form = nlapiCreateForm('Create Vehicle Sales Order/Copy Vehicle Sales Quote', false);
						var MAkeCoyFld = form.addField('custpage_advs_makecopi', 'select', 'Select Order/Quote', null, '');
						MAkeCoyFld.addSelectOption("","");
						MAkeCoyFld.addSelectOption("1","Create Sales Order");
						MAkeCoyFld.addSelectOption("2","Copy Sales Quote");
					}
				}
			}else{
				if(screen_type == "create"){
					var form = nlapiCreateForm('Copy Vehicle Sales Order/Vehicle Sales Quote', false);
					var MAkeCoyFld = form.addField('custpage_advs_makecopi', 'select', 'Select Order/Quote', null, '');
					MAkeCoyFld.addSelectOption("","");
					MAkeCoyFld.addSelectOption("1","Sales Order");
					MAkeCoyFld.addSelectOption("2"," Sales Quote");
				}
			}

			if(screen_type == 'create'){
				var transfld = form.addField('custpage_advs_transactions', 'select', 'Transactions', null, '');
				if(OrderType){
					Record_Type = OrderType;
					MAkeCoyFld.setDefaultValue(OrderTypeValue);
					populateTransactionData(OrderType,transfld);
				}
			}


			var RecordTypeFld = form.addField('custpage_advs_rec_typi', 'text', 'Record Type', null, '');
			if (Record_Type){RecordTypeFld.setDefaultValue(Record_Type);}
			RecordTypeFld.setDisplayType('hidden');

			var RecordIDFld = form.addField('custpage_advs_rec_id', 'text', 'Record ID', null, '');
			if (Record_Id){RecordIDFld.setDefaultValue(Record_Id);}
			RecordIDFld.setDisplayType('hidden');

			var screentypefld = form.addField('custpage_advs_screen_fld', 'text', 'Screen Type', null, '');
			if(screen_type){screentypefld.setDefaultValue(screen_type);}
			screentypefld.setDisplayType('hidden');

			form.setScript("customscript_advs_cs_create_vehicle_quot");
			form.addSubmitButton("Submit");
			response.writePage(form);
		}else{
			var createRecordType = request.getParameter("custpage_advs_makecopi");
			var RrecordType = request.getParameter("custpage_advs_rec_typi");
			var RrecordId = request.getParameter("custpage_advs_rec_id");
			var ViewType = request.getParameter("custpage_advs_screen_fld");
			if(ViewType == 'create'){
				RrecordId = request.getParameter("custpage_advs_transactions");
			}
			if( RrecordId && RrecordType){
				var SORecord = nlapiLoadRecord(RrecordType, RrecordId, {recordmode: 'dynamic'});

				var Customer =  SORecord.getFieldValue("entity");
				var Location  = SORecord.getFieldValue("location")
				var Subsidiary = SORecord.getFieldValue("subsidiary");
				var SalesRep = SORecord.getFieldValue("salesrep");
				var Departmentt = SORecord.getFieldValue("department");
				var ModuleName = SORecord.getFieldValue("custbody_advs_module_name");
				var SoMemo  = SORecord.getFieldValue('memo');
				var CustomerPo = SORecord.getFieldValue('otherrefnum');
				var Currency  = SORecord.getFieldValue('currency');

				nlapiLogExecution("debug", "Location", Location);
				var locLookup = nlapiLookupField('location', Location, 'isinactive');
				nlapiLogExecution("debug", "locLookup", locLookup);
				if(locLookup == "T"){
					throw nlapiCreateError('400', "The Sales Order&#34;s Location isinactive you cannot Create Quote");
				}

				if(createRecordType == '1'){
					var rec = nlapiCreateRecord('salesorder',{recordmode:'dynamic'});
					rec.setFieldText('customform','ADVS Vehicle Sales Order');

				} else{
					var rec = nlapiCreateRecord('estimate',{recordmode:'dynamic'});
					rec.setFieldText('customform','ADVS Vehicle Sales Quote');

				}
				rec.setFieldValue('entity', Customer);
				rec.setFieldValue('custbody_advs_module_name', ModuleName);
				rec.setFieldValue('department',Departmentt);
				rec.setFieldValue('subsidiary', Subsidiary);
				rec.setFieldValue('location', Location);
				rec.setFieldValue('custbody_advs_created_from', RrecordId);


				if(SalesRep){
					rec.setFieldValue('salesrep', SalesRep)
				}

				if(SoMemo){
					rec.setFieldValue('memo', SoMemo);
				}
				if(CustomerPo){
					rec.setFieldValue('otherrefnum', CustomerPo);
				}
				if(Currency){
					rec.setFieldValue('currency', Currency);
				}


				var Limit = SORecord.getLineItemCount('item');

				for(var i = 1;i <= Limit; i++){

					var InvType = SORecord.getLineItemValue('item', 'custcol_select_invtype', i);
					nlapiLogExecution("debug", "InvType_110", InvType+ "<==I==>" + i);
					//    if(InvType){

					//    }else {
					//     InvType = SORecord.getLineItemValue('item', 'custcol_select_invtype', i);
					// }

					var PartLink = SORecord.getLineItemValue('item', 'item', i);
					var Quantity = SORecord.getLineItemValue('item', 'quantity', i);
					var Rate = SORecord.getLineItemValue('item', 'rate', i);
					var Amount = SORecord.getLineItemValue('item', 'amount', i);
					var vehicleSales = SORecord.getLineItemValue('item', 'custcol_advs_vehicle_sales_vin', i);
					nlapiLogExecution("debug", "InvType_117", InvType+ "vehicleSales" +vehicleSales)
                    var servicePAckage = SORecord.getLineItemValue('item', 'custcol_advs_bsi_service_pkg', i);
					
                    rec.selectNewLineItem('item');
					// rec.setCurrentLineItemValue('item', 'custcol_advs_selected_inventory_type', InvType);
					rec.setCurrentLineItemValue('item', 'custcol_select_invtype', InvType);
					// rec.setCurrentLineItemValue('item', 'custcol_advs_task_item', PartLink);
					rec.setCurrentLineItemValue('item', 'item', PartLink);
					rec.setCurrentLineItemValue('item', 'quantity', Quantity);
					rec.setCurrentLineItemValue('item', 'rate', Rate);
					rec.setCurrentLineItemValue('item', 'amount', Amount);
					
                    // if((vehicleSales) && (ViewType != "create")){
					// 	rec.setCurrentLineItemValue('item', 'custcol_advs_vehicle_sales_vin', vehicleSales);
					// }

                    if(servicePAckage){
                        rec.setCurrentLineItemValue('item', 'custcol_advs_bsi_service_pkg', servicePAckage);
                    }

					rec.commitLineItem('item');
				}

				var soId = nlapiSubmitRecord(rec, true, true);
				nlapiLogExecution("debug", "SOID", soId);

				if(soId){
					nlapiSubmitField(RrecordType, RrecordId, 'custbody_advs_cust_direc_estimate', soId);
				}

				if(createRecordType == '1'){
					var salesRecUrl     =   nlapiResolveURL("RECORD", "salesorder", soId);
				}else{
					var salesRecUrl     =   nlapiResolveURL("RECORD", "estimate", soId);
				}
				var onclickScript=" <html><body> <script type='text/javascript'>" +
				"try{" +
				"var InvArray='"+salesRecUrl+"';" +
				"";
				onclickScript+="" +
				"var salesRecUrl='"+salesRecUrl+"';" ;
				onclickScript+="window.parent.location=salesRecUrl;";
				"theWindow.close();";
				onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
				response.write(onclickScript);
			}
		}
	} catch (e) {

		nlapiLogExecution('ERROR', 'Error on Page', e.message);
		// throw nlapiCreateError('ERROR', e.message, false);
		var errorMsg = e.message;

		var SpliteddMSg = errorMsg.split(' ');
		var SpliteddMSg1 = SpliteddMSg[1];

		// Log the array for debugging
		nlapiLogExecution('ERROR', 'SpliteddMSg', SpliteddMSg);

		// Check if the array contains the word "location"
		var containsLocation = false;
		for (var i = 0; i < SpliteddMSg.length; i++) {
			if (SpliteddMSg[i] === "location") {
				containsLocation = true;
				break;
			}
		}

		if (containsLocation) {
			throw nlapiCreateError('400', "The Sales Order&#34;s Location isinactive you cannot Create Quote");
		}else{
			// Check for the specific condition
			if (SpliteddMSg1 === "custcol_advs_vehicle_sales_vin") {
				throw nlapiCreateError('400', "The Sales Order&#34;s VIN is not available in Inventory  please check and create quote");
			}else{
				throw nlapiCreateError('ERROR', e.message, false);
			}
		}
	}
}

function populateTransactionData(OrderType,transfld){
	nlapiLogExecution('ERROR','OrderType',OrderType);
	var SearchObj = nlapiCreateSearch(OrderType,
			[
				['mainline','is','T'],
				'AND',
				['custbody_advs_module_name','anyof','1'],
              
			],
			[
				new nlobjSearchColumn("tranid"),
				new nlobjSearchColumn("internalid"),
				new nlobjSearchColumn("type")
			]
	);
	var Run = SearchObj.runSearch();
	transfld.addSelectOption('','');
	Run.forEachResult(function(result){
		var TranId = result.getValue('type')+'# '+result.getValue('tranid')
		transfld.addSelectOption(result.getValue('internalid'),TranId);
		return true;
	});
}