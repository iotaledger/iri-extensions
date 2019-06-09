var System = java.lang.System;

var spentAddressProvider = IOTA.spentAddressesProvider

var iri = com.iota.iri;
var Callable = iri.service.CallableRequest;
var Response = iri.service.dto.IXIResponse;
var ErrorResponse = iri.service.dto.ErrorResponse;

var defaultSpentFileName = "spentAddresses.txt";

// Log using logger of the ixi class
var log = org.slf4j.LoggerFactory.getLogger(iri.IXI.class);

function checkChecksumFor(file){
	var digest = java.security.MessageDigest.getInstance("SHA-256");

	var stream = new java.io.FileInputStream(file);
	var targetReader = new java.io.BufferedReader(new java.io.InputStreamReader(stream));
	
	var expectedChecksum;
	var firstLine = true;
	while (line = targetReader.readLine()){
		if (firstLine){
			firstLine = false;
		} else if (line.length() === 64){
			// Checksum
			expectedChecksum = line;
		} else {
			// Hash
			digest.update(line.getBytes());
		}
	}

	targetReader.close();
	stream.close();

	if (!expectedChecksum){
		log.error("{} did not have a checksum", file.getName());
		return false;
	}

	return expectedChecksum !== checksumFromBytes(digest.digest());
}

function updateSpentAddressesWith(file){
	if (!checkChecksumFor(file)){
		return {
			"error": "Checksum mismatch for file " + file.getName()
		}
	}

	var stream = new java.io.FileInputStream(file);
	var targetReader = new java.io.InputStreamReader(stream);
	var expectedChecksum;
	var firstLine = true;
	var i=0;
	while (line = targetReader.readLine()){
		if (firstLine){
			log.info("Importing spent addresses from {} generated at {}", file.getName(), java.util.Date(Number(line)));
		} else if (line.length() === 81){
			var hash = com.iota.iri.model.HashFactory.ADDRESS.create(line);
			spentAddressProvider.saveAddress(hash);
			i++;
		}
	}
	
	return {
		amount: i
	}
	
}

function checksumFromBytes(bytes){
	return java.lang.String.format("%064x", new java.math.BigInteger(1, bytes));
}

/*
curl http://localhost:14265 -X POST -H 'X-IOTA-API-Version: 1.4.1' -H 'Content-Type: application/json' -d '{"command": "Merge.mergeSpentAddresses"}'
*/
function generate(request) {
	var files = request["files"];
	if (!files){
		files = [defaultSpentFileName];
	}

	var errors = [];
	var total = 0;
	for (var i=0; i<files.length; i++){
		var fileName = files[i];

		var file = new java.io.File(fileName);
	    if (file.exists()){
	    	if (file.isDirectory()){
		    	log.error("Found a directory called {}, ignoring!");
		    } else {
		    	var result = updateSpentAddressesWith(file);
		    	if (result["error"]){
		    		errors.push(result["error"]);
					log.error(result["error"]);
		    	} else {
		    		total += result["amount"];
		    	}
		    }
	    } else {
	    	log.error("File {} did not exist on disk.. ignoring!", fileName)
	    }
	}

	return Response.create({
		errors: errors,
		amountAdded: total 
	});
}

API.put("mergeSpentAddresses", new Callable({ call: generate }))

