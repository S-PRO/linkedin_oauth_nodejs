/**
 * Created by codestack on 14.07.15.
 */

/**
 * This is wrapper on top of tv4 validator.
 *
 * Module takes as input
 *  - path to json schema,
 *  - req
 *  - what to validate req.body or req.query
 *
 *  Then module validates data and send back result or trigger next()
 *
 * @param tv4
 * @param fs
 */

var tv4 = require('tv4'),
fs = require('fs');

/**
 * cache already retrieved schemas
 * @type {{}}
 */
var schemas = {},

/**
 * get schema and cache it to schemas variable
 * @param url
 * @returns {*}
 */
getSchema = function (url) {
    if (!(url in schemas)){
        var _file = fs.readFileSync(url, 'utf8');
        if(_file){
            schemas[url] = JSON.parse( _file );
        }else{
            console.error('json file '+url+' not found');
            return false;
        }
    }
    return schemas[url];
},

/**
 * trigger tv4 plugin method to validate data via json schema file
 * @param params
 * @param url
 * @returns {*}
 * @private
 */
__validate = function (params, url) {
    if(typeof(params) === "undefined"){
        var params = {};
    }
    return tv4.validateMultiple(params, getSchema(url));
},
/**
 * Send response based on validation result
 * @param result
 * @param res
 * @param next
 * @returns {*}
 */
sendResponse = function (result, res, next) {
    if (result.valid === false){
        /**
         * TODO: maintain response depending on tv4 response
         */
        return res.status(400).json(result);
    }else{
        return next();
    }
},

/**
 * Validator class
 * @constructor
 */
Validator = function(){
    /**
     * default value is empty string
     * @type {string}
     */
    this.base_path = "";
};

/**
 * Pass default path for module
 * @param base_path
 */
Validator.prototype.setBasePath = function(base_path){
    this.base_path = base_path;
    return this;
};

/**
 * method validates
 * @param params_type
 * @param file_path
 * @param not_use_base_path
 * @returns {Function}
 */
Validator.prototype.validate = function (params_type, file_path, not_use_base_path) {
    var self = this,
    __file_path = (function(){
        if(!file_path){
            return false;
        }
        var ___path = typeof(file_path) === 'function' ? file_path() : file_path;

        if(self.base_path && !not_use_base_path){
            ___path = self.base_path + ___path;
        }
        return ___path;
    }());

    if (params_type === "query" || params_type === "body"){
        return function (req, res, next) {
            return sendResponse(
                __validate(
                    req[params_type],
                    __file_path
                ),
                res,
                next
            );
        };
    }else{
        return function (req, res) {
            console.log({error: "validator params are not correct"})
            return res.status(400).json({error: "validator params are not correct"});
        }
    }
};

/**
 * return Validator Class
 */
module.exports = Validator;