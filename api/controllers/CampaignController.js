/**
 * CampaignController
 *
 * @description :: Server-side logic for managing campaigns
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res){
		Campaign.find({owner: req.current_user.id}).exec((err, campaigns) => {
			if (err) return ResponseService.json(401, res, "There was an error creating your campaign", {error: true})

			return ResponseService.json(200, res, "Success", campaigns)
		})
	},

	create: function(req,res){
		let payload = req.body
		payload["owner"] = req.current_user.id
		Campaign.create(payload).exec((err, campaign) => {
			if (err) return ResponseService.json(401, res, "There was an error creating your campaign", {error: true})
			let responseData = {
				campaignID: campaign.id
			}

			return ResponseService.json(200, res, "Success", responseData)
		})
	},

	show: function(req, res){
		let campaignID = req.param('id')

		Campaign.find(campaignID).exec((err, campaign) => {
			if (err) return ResponseService.json(404, res, "Campaign not found", {error: true})

			return ResponseService.json(200, res, "Success", campaign)

		})
	},

};
