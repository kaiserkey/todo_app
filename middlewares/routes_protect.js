const jwt = require('jsonwebtoken'),
        auth = require('../config/auth'),
        { dbConfig } = require('../database/db_con')

module.exports = (req, res, next)=>{
        if( !req.cookies['x-access-token']){
            res.render('error', {msg: 'Acceso no autorizado'})
        }else{
            //comprobar la validez del token
            const token = req.cookies['x-access-token']
            
            jwt.verify(token, auth.secret, (err, decoded)=>{
                if(err){
                    res.render('error', {msg: 'Ocurrio un problema en la autenticacion del token'})
                }else{
                    dbConfig.User.findByPk( decoded.user.id ).then(
                        user => {
                            req.user = user
                            next()
                        }
                    )
                }
            })
            
        } 
    
}