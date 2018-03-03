/**
 * Campaign.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    campaign: {
      type: "text"
    },
    style: {
      type: "text"
    },
    owner: {
      model: 'user'
    },
    fingerprints:{
      collection: 'fingerprint',
      via: 'owner'
    }
  },
connection: "someMongodbServer"
};
