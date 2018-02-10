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
		//var line2 = lines[i+1];

		var town = new Town(dataPerTown);

		towns.push(town);
	}

	return towns;

};

class Town {

	constructor(data) {
		var datas = data.split('&');
		this.townName = this.parseTownName(datas[1]);
 		
 		var averageAppartmentPrice = datas[3];
 		var appartmentPriceVariationInTrimester = datas[4];
 		var appartmentPriceVariationInOneYear = datas[5];
 		var appartmentPriceVariationInFiveYear = datas[6];

		this.appartment = new Appartment(averageAppartmentPrice, appartmentPriceVariationInTrimester, appartmentPriceVariationInOneYear, appartmentPriceVariationInFiveYear);
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

class Appartment {
	constructor(averageAppartmentPrice, appartmentPriceVariationInTrimester, appartmentPriceVariationInOneYear, appartmentPriceVariationInFiveYear) {
		this.averageAppartmentPrice = averageAppartmentPrice.split('=')[1];
		this.appartmentPriceVariationInTrimester = appartmentPriceVariationInTrimester.split('=')[1];
		this.appartmentPriceVariationInOneYear = appartmentPriceVariationInOneYear.split('=')[1];
		this.appartmentPriceVariationInFiveYear = appartmentPriceVariationInFiveYear.split('=')[1];
	}
}

class Variation {
	constructor(duration, variation) {
		this.duration = duration;
		this.variation = variation
	}
}


readNotaryFile();