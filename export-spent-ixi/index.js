var System = java.lang.System;

var spentAddressProvider = IOTA.spentAddressesProvider
var tangle = IOTA.tangle;
var config = IOTA.configuration;

var iri = com.iota.iri;
var Callable = iri.service.CallableRequest;
var Response = iri.service.dto.IXIResponse;
var ErrorResponse = iri.service.dto.ErrorResponse;

var RocksDBPersistenceProvider = iri.storage.rocksDB.RocksDBPersistenceProvider;
var SpentAddress = iri.model.persistables.SpentAddress;

var HashFactory = iri.model.HashFactory;

var fileName = "spentAddresses.txt";
var HashMap = java.util.HashMap;

// Log using logger of the ixi class
var log = org.slf4j.LoggerFactory.getLogger(iri.IXI.class);

/*
curl http://localhost:14265 -X POST -H 'X-IOTA-API-Version: 1.4.1' -H 'Content-Type: application/json' -d '{"command": "Spent.generateSpentAddressesFile"}'
*/
function generate(request) {
	var file = new java.io.File(fileName);
    if (file.exists()){
    	if (file.isDirectory()){
	    	log.error("Found a directory called {}, aborting!");
	    	return ErrorResponse.create("Failed to create spent address due to {} beeing a folder", fileName);
	    } else {
	    	log.info("{} already exists.. Overwriting!", fileName);
	    }
    } else {
    	file.createNewFile();
    }

    var hashes = spentAddressProvider.getAllAddresses();
    var writer = new java.io.FileWriter(file);
    var separator = System.getProperty("line.separator");
    // Start with the time
    writer.write(System.currentTimeMillis() + separator);

    for (var i=0; i<hashes.length; i++){
    	var hash = hashes[i];

    	writer.write(hash.toString() + separator);

    	if (i % 100 === 99) {
    		writer.flush;
    	}
    }

    writer.close();

    return Response.create({
		amount: hashes.length,
		fileName: fileName,
		sizeInKb: file.length() / (1024 * 1024),
		checksum: checksum(file)
	});
}

function checksum(file) {
	var inStream = new java.io.FileInputStream(input);
    var digest = java.security.MessageDigest.getInstance("sha256");
    var block = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024)
    var length = inStream.read(block);
    while (length > 0) {
        digest.update(block, 0, length);
        length = inStream.read(block);
    }
    return digest.digest();
}

API.put("generateSpentAddressesFile", new Callable({ call: generate }))

