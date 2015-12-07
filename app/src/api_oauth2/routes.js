
var oauth2Controller = require('./oauth2Controller');

module.exports = function(server, validator){
    server.route('/oauth2/linkedin')
        .post(
            validator.validate('body', 'api_oauth2/oauth2.json'),
            oauth2Controller.login
        )
};