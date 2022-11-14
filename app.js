'use strict'

require('dotenv').config()
const express = require( 'express' ),
        pug = require( 'pug' ),
        morgan = require( 'morgan' ),
        publicDir = express.static( `${ __dirname }/publics` ),
        viewsDir = `${ __dirname }/views`,
        port = ( process.env.HTTP_PORT  || 4000),
        { connection } = require( './database/db_con' ),
        { dbConfig } = require( './database/db_con' ),
        router = require( './routes/router' ),
        cookieParser = require('cookie-parser'),
        passport = require('passport'),
        GitHubStrategy = require('passport-github2').Strategy,
        app = express(),
        session = require('express-session')
        
app.use(session({
    secret: 's3cr3t',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}))
    .use(passport.initialize())
    .use(passport.session())

passport.serializeUser(function(user, done) {
    done(null, user)
})

passport.deserializeUser(function(user, done) {
    done(null, user)
})

passport.use(new GitHubStrategy(
    {
        clientID: "7a653bf4f8fc676ec862",
        clientSecret: "8475d8696e73a0ea31466124b59701de8315b40f",
        callbackURL: "http://localhost:4000/github/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
        return done(null, profile)
    }
))

app// configurando app
    .set( 'view engine', 'pug' )
    .set( 'views', viewsDir )
    .set( 'port', port )
    //ejecutando middlewares
    .use(cookieParser())
    .use( express.json() )
    .use( express.urlencoded({extended: false}) )
    .use( publicDir )
    .use( morgan('dev') )
    //ejecutando el middleware enrutador
    .use( router )    
    .listen( port, 
        ()=>{
            console.log(`Iniciando en el puerto http://localhost:${port}`)
            connection.con()
        }
    )