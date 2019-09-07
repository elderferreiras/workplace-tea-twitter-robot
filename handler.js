'use strict';
var OAuth = require('oauth');

module.exports.submit = function (event, context, callback) {
    const params = JSON.parse(event.body);

    if (params.tea) {
        const tea = decodeURIComponent(params.tea);

        if (tea.length > 0) {
            const twitter_application_consumer_key = process.env.API_KEY;  // API Key
            const twitter_application_secret = process.env.API_SECRET_KEY;  // API Secret
            const twitter_user_access_token = process.env.ACCESS_TOKEN;  // Access Token
            const twitter_user_secret = process.env.ACCESS_TOKEN_SECRET;  // Access Token Secret

            const oauth = new OAuth.OAuth(
                'https://api.twitter.com/oauth/request_token',
                'https://api.twitter.com/oauth/access_token',
                twitter_application_consumer_key,
                twitter_application_secret,
                '1.0A',
                null,
                'HMAC-SHA1'
            );

            let url = '';

            if(params.id) {
                url = ` https://www.workplacetea.com/tea/${params.id}`;
            }

            const status = `${tea} #WorkplaceTea${url}`;  // This is the tweet (ie status)

            const postBody = {
                'status': status
            };

            oauth.post('https://api.twitter.com/1.1/statuses/update.json',
                twitter_user_access_token,  // oauth_token (user access token)
                twitter_user_secret,  // oauth_secret (user secret)
                postBody,  // post body
                '',  // post content type ?
                function (err, data, res) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, response({message: "Success!"}));
                    }
                });

        } else {
            callback(null, response({message: "Failed!"}));
        }
    } else {
        callback(null, response({message: "Failed!"}));
    }
};

const response = (data) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "https://www.workplacetea.com",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(data),
    }
};