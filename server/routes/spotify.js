const express = require('express')
const path = require('path')
const random = require('../util/random')
const request = require('request')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')
const CONSTANTS = require('../constants')
const config = require('../config')

const router = express.Router();
const stateKey = 'spotify_auth_state';

router.get('/login', (req, res) => {
    const state = random.generateRandomString(16);
    const scope = CONSTANTS.SCOPE;
    const query = querystring.stringify({
        response_type: 'code',
        client_id: config.client_id,            
        redirect_uri: config.redirect_uri,
        scope,
        state
    });

    res.cookie(stateKey, state);
    
    res.redirect(`${CONSTANTS.AUTHORIZATION_URL}?${query}`);
});

router.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
            error: 'state_mismatch'
        }));
    } else {
        res.clearCookie(stateKey);
        const basic = new Buffer(`${config.client_id}:${config.client_secret}`).toString('base64');        
        const authOptions = {
            url: CONSTANTS.API_TOKEN_URL,
            form: {
                code: code,
                redirect_uri: config.redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': `Basic ${basic}`
            },
            json: true
        };

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token,
                    refresh_token = body.refresh_token;

                const options = {
                    url: CONSTANTS.SPOTIFY_ABOUT_ME_URL,
                    headers: { 'Authorization': `Bearer ${access_token}` },
                    json: true
                };

                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                res.redirect('/#' +
                    querystring.stringify({
                    access_token,
                    refresh_token
                }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                    error: 'invalid_token'
                }));
            }
        });
    }
});

router.get('/refresh_token', (req, res) => {
    const refresh_token = req.query.refresh_token;
    const basic = new Buffer(`${config.client_id}:${config.client_secret}`).toString('base64');
    const authOptions = {
        url: CONSTANTS.API_TOKEN_URL,
        headers: { 'Authorization': `Basic ${basic}` },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            res.send({access_token});
        }
    });
});

module.exports = router;
