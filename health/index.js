var iri = com.iota.iri;
var Callable = iri.service.CallableRequest;
var Response = iri.service.dto.IXIResponse;
var ErrorResponse = iri.service.dto.ErrorResponse;
var snapshotProvider  = IOTA.snapshotProvider;
var milestoneSolidifier = IOTA.milestoneSolidifier;

function getHealth(){
    try {
        if (snapshotProvider.getLatestSnapshot().getIndex() >= milestoneSolidifier.getLatestMilestoneIndex() - 5) {
            return Response.create("Node fully synced.");
        } else {
            return ErrorResponse.create("Node not synced.");
        }
    } catch (exception) {
        return ErrorResponse.create(exception.getCause ? exception.getCause() : exception);
    }


}

API.put("getHealth", new Callable({ call: getHealth }));