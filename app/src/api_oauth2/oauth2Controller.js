var AuthService = require('./AuthService'),
    User = require('./UserSchema');

module.exports = {
    login: function(req, res){

        /**
         * get token by code
         */
        AuthService.get_linkedin_token(req.body.code).then(function(token_data){

            console.log('token_data', token_data);

            /**
             * get user data
             */
            AuthService.get_linkedin_user_data(token_data.access_token).then(function(user_profile_data){

                /**
                 * create user record
                 */
                new User({
                    first_name: user_profile_data.firstName,
                    last_name: user_profile_data.lastName,
                    title: user_profile_data.headline,
                    linkedin_id: user_profile_data.id
                }).save(function(error, result) {
                    if (error){
                        console.error('save error', error);
                        res.status(400).json(error);
                    }else{
                        res.json(result);
                    }
                });

                //res.json(user_profile_data);

            }, function(error){
                console.error('get_linkedin_user_data', error);
                res.status(400).json(error);
            });

        }, function(error){
            console.error('get_linkedin_token', error);
            res.status(400).json(error);
        });

    }
};