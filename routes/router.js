const express = require('express'),
        router = express.Router(),
        authConf = require('../config/auth'),
        jwt = require('jsonwebtoken'),
        helppers = require('../helppers/helppers'),
        //controllers
        AuthController = require('../controllers/AuthController'),
        UserController = require('../controllers/UserController'),
        TaskController = require('../controllers/TaskController'),
        TodoListController = require('../controllers/TodoListController'),
        Task_Assigned_Controller = require('../controllers/Task_Assigned_Controller'),
        passport = require('passport'),
        //Middlewares
        routes_protect = require('../middlewares/routes_protect'),
        { body, validationResult } = require('express-validator')


//rutas de la app
router.get('/signup',(req, res)=>{ res.render('signup') })
        .get('/' , AuthController.ifSigned)
        .get('/home' ,routes_protect, UserController.home)
        .get('/order' ,routes_protect, UserController.home)
        .get('/archived' ,routes_protect, TodoListController.archived)
        .get('/task', routes_protect, TaskController.home)
        .get('/todolist' ,routes_protect, TodoListController.home)
        .get('/logout' ,routes_protect,UserController.logout)
        .post('/registro',

            // username must be an email
            body('email').isEmail(),
            // password must be at least 5 chars long
            body('password').isLength({ min: 5 }),

            AuthController.signUp)
        .post('/login', AuthController.signIn)
        .post('/task/create',routes_protect, TaskController.create)
        .get('/task/delete/:id',routes_protect, TaskController.delete)
        .get('/task/update',routes_protect, TaskController.update)
        .post('/todolist/create',routes_protect, TodoListController.create)
        .get('/todolist/show/:id',routes_protect, TodoListController.show)
        .get('/todolist/addtask',routes_protect, TodoListController.addtask)
        .get('/todolist/delete/:id',routes_protect, TodoListController.delete)
        .get('/todolist/update',routes_protect, TodoListController.update)
        .get('/todolist/archivar/:id',routes_protect, TodoListController.archivate)
        .get('/asignTask',routes_protect, UserController.asignTask)
        .get('/taskaccept',routes_protect, Task_Assigned_Controller.accept)
        .get('/auth/error', (req,res)=>{ res.render('signin', { gitErr: true }) })
        .get('/gitlogin' )
        .get('/github', passport.authenticate('github'))
        .get('/github/callback', passport.authenticate('github', 
                { failureRedirect: '/auth/error' }),
                async function(req, res) {
                    
                    const userGitHub = await dbConfig.User.findOrCreate(
                        {
                            where: {
                                email: req.user.emails[0].value,
                            },
                            defaults: {
                                nick_name: req.user.username,
                                email: req.user.emails[0].value,
                            }
                        }
                    )

                    const token = await jwt.sign({user: userGitHub[0].dataValues}, authConf.secret, {
                        expiresIn: authConf.expire
                    })

                    let options = {
                        path:"/",
                        sameSite:false,
                        maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                        httpOnly: true, // The cookie only accessible by the web server
                    }
                    
                    res.cookie('x-access-token', token, options)

                    if(res.cookie('x-access-token', token, options)){
                        res.redirect('/home')
                    } 
                }
            )

router.use(helppers.err404)

module.exports  = router