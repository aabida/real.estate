'using strict';

const request = require('request');
const fs = require('fs');

const URL_NOTAIRES_IDF = 'http://www.notaires.paris-idf.fr/outil/immobilier/datas.txt';

function callNotaryWebsite() {
	request(URL_NOTAIRES_IDF, function (error, response, body) {
	    if (error) {
	      return console.error('upload failed:', error);
	    }
	    //console.log('Upload successful!  Server responded with:', body);

	    parseBody(body);
	});
}

function readNotaryFile() {
	fs.readFile('/home/ahmed/Téléchargements/datas.txt', 'utf8', function(err, contents) {

    	var towns = parseBody(contents);
    	console.log(JSON.stringify(towns, null, 2));
	});
}

var parseBody = function(body) {
	var lines = body.split('\n\n');

	var towns = [];
	for (var i = 0; i< lines.length - 1; i++) {
		var dataPerTown = lines[i];

		var town = new Town(dataPerTown);

		towns.push(town);
	}

	return towns;

};

class Town {

	constructor(data) {
		var datas = data.split('\n');
		this.townName = this.parseTownName(datas[0]);
 		
 		var appartmentRawData = datas[1];
 		var houseRawData = datas.length > 2 ? datas[2] : null;

		this.appartment = new Appartment(appartmentRawData);
		this.house = new House(houseRawData);
	}

	parseTownName(rawTownName) {
		var rawData = rawTownName.split('=');
		var townName = rawData[1];
		var zipCode = rawData[0].split('_')[1];

		return {
			townName: townName,
			zipCode : zipCode
		};
	}
	
}

class DataParser {
	parse(rawData) {
		var splittedData = rawData.split('&');

		var i = 1;
		var averagePrice = splittedData[i++];
		var priceVariationInTrimester = splittedData[i++];
		var priceVariationInOneYear = splittedData[i++];
		var priceVariationInFiveYear = splittedData[i++];

		return {
			averagePrice : averagePrice.split('=')[1],
			priceVariationInTrimester : priceVariationInTrimester.split('=')[1],
			priceVariationInOneYear : priceVariationInOneYear.split('=')[1],
			priceVariationInFiveYear : priceVariationInFiveYear.split('=')[1]
		}
	}
}
class Appartment {
	constructor(appartmentRawData) {
		var dataParser = new DataParser();
		
		var parsedData = dataParser.parse(appartmentRawData);

		this.averageAppartmentPrice = parsedData.averagePrice;
		this.priceVariationInTrimester = parsedData.priceVariationInTrimester;
		this.priceVariationInOneYear = parsedData.priceVariationInOneYear;
		this.priceVariationInFiveYear = parsedData.priceVariationInFiveYear;
	}

}

class House {
	constructor(houseRawData) {
		if (houseRawData !== null) {
			var dataParser = new DataParser();
			
			var parsedData = dataParser.parse(houseRawData);

			this.averageHousePrice = parsedData.averagePrice;
			this.priceVariationInTrimester = parsedData.priceVariationInTrimester;
			this.priceVariationInOneYear = parsedData.priceVariationInOneYear;
			this.priceVariationInFiveYear = parsedData.priceVariationInFiveYear;
		}
	}
}


readNotaryFile();

