/**
 * Created by codestack on 07.12.15.
 */
module.exports = {
    URL: 'https://www.linkedin.com/uas/oauth2/accessToken',
    PROFILE_URL: 'https://api.linkedin.com/v1/people/~?format=json',
    PARAMS: {
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:9000/oauth2/linkedin',
        client_id: '77umk3dqqraozh',
        client_secret: '4DBBWYyZR8rRxsTo'
    }
};