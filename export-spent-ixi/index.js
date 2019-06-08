
var System = java.lang.System;

var transactionRequester = IOTA.transactionRequester

var iri = com.iota.iri;
var Callable = iri.service.CallableRequest;
var Response = iri.service.dto.IXIResponse;
var ErrorResponse = iri.service.dto.ErrorResponse;


/*
curl http://localhost:14265 -X POST -H 'X-IOTA-API-Version: 1.4.1' -H 'Content-Type: application/json' -d '{"command": "LedgerState.getRequest"}'
*/
function getRequest(request) {
	var trans = transactionRequester.getRequestedTransactions()
	var hashes = [];
	for (var i = 0; i < trans.length; i++) {
		hashes[i] = trans[i].toString();
	}
	

    return Response.create({
		transactions: hashes
	});
}

API.put("getRequest", new Callable({ call: getRequest }))

