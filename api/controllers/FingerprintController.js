/**
 * FingerprintController
 *
 * @description :: Server-side logic for managing fingerprints
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require("bluebird");
var lodash = require("lodash");

module.exports = {
	index: function(req,res){
		let fingerprintData = req.body
		fingerprintData["owner"] = req.params.id
		fingerprintData["conversion"] = false

		Fingerprint.find({owner: req.params.id}).exec(function(err, fingerprints){
			if(fingerprints.length == 0){
				Fingerprint.create(fingerprintData).exec(function(err,success){
					return res.json({id: success.id, newUser: true})
				})
			} else {
				let requestBody = req.body
	      let requestKeys = Object.keys(requestBody)

	      var printTotals = {}

	      new Promise(() => {

	        fingerprints.forEach(fingerprint => {

	        let sharedAttributes = []
	        let fingerprintKeys = Object.keys(fingerprint)
	        lodash.pull(fingerprintKeys, '_id', 'updatedAt', 'createdAt', 'owner');

	        for(i=0; i < fingerprintKeys.length; i++){
	          if(fingerprintKeys[i] == "plugins"){
	            let intersection = fingerprint[fingerprintKeys[i]].filter((n) => requestBody[requestKeys[i]].includes(n))
	            if(intersection.length/fingerprint[fingerprintKeys[i]].length > 0.75){
	              sharedAttributes.push(fingerprintKeys[i])
	            }
	          } else if(fingerprint[fingerprintKeys[i]] == requestBody[requestKeys[i]]){
	            sharedAttributes.push(fingerprintKeys[i])
	          }
	        }

	        var sharedPct = sharedAttributes.length/requestKeys.length
	        var depth = 0

	        const weightedEntropy = () => {
	          if(lodash.inRange(sharedPct, 0.30, 0.70) && depth < 2){
	            let entropyOfObjects = {}
	            let totalEntropy = 0
	            for(i=0;i < requestKeys.length; i++){

	               if(requestKeys[i] == 'ip'){
	                 entropy = -(Math.log2(1/100))
	                 entropyOfObjects[requestKeys[i]] = entropy
	                 totalEntropy += entropy
	               } else if(requestKeys[i] == 'gpu'){
	                 entropy = -(Math.log2(1/50))
	                 entropyOfObjects[requestKeys[i]] = entropy
	                 totalEntropy += entropy
	               } else if(requestKeys[i] == 'plugins'){
	                 entropy = -(Math.log2(1/25))
	                 entropyOfObjects[requestKeys[i]] = entropy
	                 totalEntropy += entropy
	               } else {
	                 entropy = -(Math.log2(1/2))
	                 entropyOfObjects[requestKeys[i]] = entropy
	                 totalEntropy += entropy
	               }
	             }

	             sharedPct = 0
	             sharedAttributes.forEach(attr => {
	               sharedPct += entropyOfObjects[attr]/totalEntropy
	             })

	             depth += 1
	             weightedEntropy()

	          } else if(sharedPct > 0.70){
	            printTotals[fingerprint.id] = sharedPct
	          } else if(sharedPct < 0.30){
	            return console.log("% too low to proceed", sharedPct)
	          } else {
	            printTotals[fingerprint.id] = sharedPct
	            return console.log("Maximum recursive depth reached. Final %: ", sharedPct)
	          }
	        }
	        weightedEntropy()
	        })
	      })

	      let printTotalsKeys = Object.keys(printTotals).sort(function(a, b) { return printTotals[b] - printTotals[a] })

	      if(printTotals[printTotalsKeys[0]] < 0.65){
					Fingerprint.create(fingerprintData).exec(function(err,success){
						if (err) return console.log(err)
						res.json({id: printTotalsKeys[0], newUser: true})
					})
	      } else {
	        res.json({id: printTotalsKeys[0], newUser: false})
	      }
			}
		})
	},

	show: function(req,res){
		let campaignID = req.params.id

		Fingerprint.find({owner: campaignID}).exec((err, fingerprints) => {
			if (err) return console.log(err)
			return ResponseService.json(200, res, "Fingerprints", fingerprints)
		})
	},

	conversion: function(req, res){
		let fingerprint_id = req.param('id')

		Fingerprint.update({id: fingerprint_id}, {conversion: true}).exec((err,success) => {
			if (err) {
				// handle error here- e.g. `res.serverError(err);`
				return;
			}
			res.json({stat: "success"})

		})

	}
};
