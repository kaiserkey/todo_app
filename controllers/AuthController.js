const { dbConfig } = require( '../database/db_con' ),
        bcrypt = require( 'bcrypt' ),
        jwt = require( 'jsonwebtoken' ),
        authConf = require( '../config/auth' ),
        { Op } = require( "sequelize" ),
        { body, validationResult } = require( 'express-validator' )

module.exports = {
    async signIn( req,res ){
        
        try {
            const {email, password} = req.body

            const user = await dbConfig.User.findOne( 
                {
                    where: {
                        email: email,
                        password: {
                            [Op.ne]: null
                        }
                    }
                }
            )
            
            if( !user ){
                res.render( 'signin', {error: 'login'} )
            }else{
                if( bcrypt.compareSync( password, user.password ) ){
                    console.log( bcrypt.compareSync( password, user.password ) )
                    //devolver token
                    const token = await jwt.sign( {user: user}, authConf.secret, {
                        expiresIn: authConf.expire
                    } )

                    let options = {
                        path:"/",
                        sameSite:true,
                        maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                        httpOnly: true, // The cookie only accessible by the web server
                    }
                    //req.headers["x-access-token"] = token
                    req.session.token = token
                    res.cookie( 'x-access-token', token, options )
                    //probar guardar el token en otra variable
                    
                    res.redirect( '/home' ) 

                }else{
                    res.render( 'signin',{ error: 'password' } )
                }
            }

        } catch ( error ) {
            res.status( 500 ).json( error )
        }
    },

    async signUp( req,res ){
        const errors = validationResult( req )
        if ( !errors.isEmpty(  ) ) {
            if( errors.array(  )[0].param=='password' ){
                return res.render( 'signup', { err: 'password' } )
            }
            if( errors.array(  )[0].param=='email' ){
                return res.render( 'signup', { err: 'email' } )
            }
        }
        const existUser = await dbConfig.User.findOne( 
            {
                where: {
                    email: req.body.email
                }
            }
        )
        
        if( existUser ){
            res.render( 'signup', { existUser: true } )
        }else{
            const hash = bcrypt.hashSync( req.body.password, parseInt( authConf.round ) )
        
            const user = await dbConfig.User.create( 
                    {
                        nick_name: req.body.name,
                        email: req.body.email,
                        password: hash
                    }
            )

            if( user ){
                return res.render( 'signin', {registro: true} )
            }
        }
        
    },

    ifSigned( req, res ){
        if( !req.cookies['x-access-token'] ){
            return res.render( 'signin' )
        }else{
            return res.redirect( '/home' )
        }
    }
}