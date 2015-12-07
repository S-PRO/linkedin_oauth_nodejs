/**
 * Created by codestack on 07.11.15.
 */
/**
 * Created by codestack on 14.07.15.
 */

/**
 * require express and helpers
 */
var mongoose = require('mongoose'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Server = express(),
    general_config = require('./config/general.config'),
    colors = require('colors'),
    default_color_theme = require('./config/colors.config'),

    /**
     * Get database config
     * @type {*|exports|module.exports}
     */
    db_config = require('./config/db.config'),

    /**
     * generate MongoDB connection string
     * @returns {string}
     */
    get_mongo_connection_string = function(){
        if(!db_config.mongo){
            throw new Error("Database configuration param is missing: mongo config");
        }
        var mongo_config = db_config.mongo;

        if(!mongo_config.host){
            throw new Error("Database configuration param is missing: host");
        }
        if(!mongo_config.port){
            throw new Error("Database configuration param is missing: port");
        }
        if(!mongo_config.database){
            throw new Error("Database configuration param is missing: database");
        }
        return 'mongodb://'+mongo_config.host+':'+mongo_config.port+'/'+mongo_config.database;
    };

/**
 * Setting up colors.
 */
colors.setTheme(default_color_theme);


mongoose.connect(get_mongo_connection_string(), function(){

    /**
     * Adding Parser limits
     */
    Server.use(bodyParser.json({limit: '50mb'}));
    Server.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



    Server.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    /**
     * Run Auth
     */
    var _Validator = require('./src/endpoint_validator/endpoint_validator'),
        endpoint_validator = new _Validator().setBasePath(__dirname+'/src/');



    /**
     * init modules
     */
    [
        'api_oauth2'
    ].map(function(module_name){
        require('./src/'+ module_name +'/routes')(
            Server, endpoint_validator
        );
    });

    /**
     * Run Application server
     */
    try {
        Server.listen(3001);
        console.info("Server is running on port: 3001");
    }catch(e){
        console.error("Error: Server run failed");
    }


});