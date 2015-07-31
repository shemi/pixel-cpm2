/**
 * Created by pixel on 26/07/2015.
 */
'use strict';

module.exports = function(app, mongoose){
    var accountSchema = new mongoose.Schema({
        user: {
            id: {type: mongoose.Schema.ObjectId, ref: 'User'},
            name: {type: String, default: ''}
        },
        lang: {type: String, default: 'en'},
        isVerified: {type: String, default: ''},
        verificationToken: { type: String, default: '' },
        name: {
            first: { type: String, default: '' },
            middle: { type: String, default: '' },
            last: { type: String, default: '' },
            full: { type: String, default: '' }
        },
        organization: [mongoose.modelSchemas.organization],
        selectedOrganization: {type: mongoose.Schema.ObjectId, ref: 'organization'},
        search: [String]
    });

    accountSchema.plugin(require('./plugins/pagedFind'));
    accountSchema.index({ user: 1 });
    accountSchema.index({ search: 1 });
    accountSchema.index({ organization: 1 });
    accountSchema.index({ selectedOrganization: 1 });
    accountSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('Account', accountSchema);
};