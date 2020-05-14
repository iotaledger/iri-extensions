var iri = com.iota.iri;
var Callable = iri.service.CallableRequest;
var Response = iri.service.dto.IXIResponse;
var ErrorResponse = iri.service.dto.ErrorResponse;
var snapshotProvider  = IOTA.snapshotProvider;

var milestoneSolidifier = IOTA.milestoneSolidifier;
var latestMilestoneTracker = IOTA.latestMilestoneTracker;

var DELAY = 5;

function getHealth(){
    try {
        var latestIndex = latestMilestoneTracker ? latestMilestoneTracker.getLatestMilestoneIndex() : milestoneSolidifier.getLatestMilestoneIndex();
        if (snapshotProvider.getLatestSnapshot().getIndex() >= latestIndex - DELAY) {
            return Response.create("Node fully synced.");
        } else {
            return ErrorResponse.create("Node not synced.");
        }
    } catch (exception) {
        return ErrorResponse.create(exception.getCause ? exception.getCause() : exception);
    }


}

API.put("getHealth", new Callable({ call: getHealth }));