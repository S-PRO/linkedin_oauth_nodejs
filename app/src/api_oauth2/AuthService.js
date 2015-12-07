/**
 * Created by codestack on 07.12.15.
 */

var request = require('request'),
    Q = require('q'),
    LINKEDIN_CONFIG = require('./../../config/linked_in.config');

module.exports = {

    /**
     * Get token by code
     * @param code
     * @returns {*|promise}
     */
    get_linkedin_token: function(code){
        var deferred = Q.defer();

        LINKEDIN_CONFIG.PARAMS.code = code;

        request.post(LINKEDIN_CONFIG.URL, {
            form: LINKEDIN_CONFIG.PARAMS
        }, function(error, response, body) {
            if(error){
                deferred.reject(error);
            }else{
                var _body = JSON.parse(body);
                if(_body.error){
                    deferred.reject(_body);
                } else {
                    /**
                     * success
                     */
                    deferred.resolve(_body);
                }
            }
        });

        return deferred.promise;
    },

    /**
     * Get Profile data by token
     * @returns {*|promise}
     */
    get_linkedin_user_data: function(token){
        var deferred = Q.defer();

        request({
            url: LINKEDIN_CONFIG.PROFILE_URL,
            headers: {
                Authorization: 'Bearer '+token
            }
        }, function(error, response, body) {
            if(error){
                deferred.reject(error);
            }else{
                var _body = JSON.parse(body);
                if(_body.error){
                    deferred.reject(_body);
                } else {
                    /**
                     * success
                     */
                    deferred.resolve(_body);
                }
            }
        });

        return deferred.promise;
    }

};