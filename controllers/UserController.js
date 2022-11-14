const { dbConfig } = require('../database/db_con'),
        helppers = require('../helppers/helppers'),
        { Op } = require("sequelize")

module.exports = {

    async home(req, res){
        const tasklist = [], todolist = [], assigned = []
        const orderby = req.query.by || 'title'
        console.log(orderby)
        const userTasks = await dbConfig.Task.findAll({ 
            order: [
                [orderby, 'ASC'],
            ],
            where: 
            {
                user_id: req.user.id
            } 
        }),
            userTodos = await dbConfig.TodoList.findAll({ 
                include: {
                    association: 'task_assigned',
                    attributes: ['status', 'todolist_id']
                },
                where: 
                {
                    user_id: req.user.id,
                } 
            }),
            assignedTo = await dbConfig.Task_Assigned.findAll(
                {
                    where: {
                        assignedto: req.user.id
                    },
                    include:{
                        association: 'task_list_asigned'
                    }
                }
                )
        
        for (let i = 0; i < assignedTo.length; i++) {
            assigned.push(
                {
                    id: assignedTo[i].id,
                    assignedby: assignedTo[i].assignedby,
                    acepted: assignedTo[i].acepted,
                    assignedto: assignedTo[i].assignedto,
                    task_list_asigned: {
                        id: assignedTo[i].task_list_asigned.id,
                        title: assignedTo[i].task_list_asigned.title,
                        created: helppers.transformDates(new Date(assignedTo[i].task_list_asigned.created)),
                        finished: (assignedTo[i].task_list_asigned.finished) ? helppers.transformDates(new Date(assignedTo[i].task_list_asigned.finished)) : null,
                        description: assignedTo[i].task_list_asigned.description,
                        priority: assignedTo[i].task_list_asigned.priority,
                        status: assignedTo[i].task_list_asigned.status,
                        deadline: helppers.transformDates(new Date(assignedTo[i].task_list_asigned.deadline)),
                        user_id: assignedTo[i].task_list_asigned.user_id
                    }
                }
            )
        }
        
        for (let i = 0; i < userTasks.length; i++) {
            if (userTasks[i].todolist_id == null) {
                tasklist.push(

                    {
                        id: userTasks[i].id,
                        title: userTasks[i].title,
                        created: helppers.transformDates(new Date(userTasks[i].created)),
                        finished: (userTasks[i].finished) ? helppers.transformDates(new Date(userTasks[i].finished)) : null,
                        description: userTasks[i].description,
                        priority: userTasks[i].priority,
                        status: userTasks[i].status,
                        deadline: helppers.transformDates(new Date(userTasks[i].deadline)),
                        user_id: userTasks[i].user_id
                    }
                )
            }
        }

        for (let i = 0; i < userTodos.length; i++) {
            if(userTodos[i].archived == 'not' || userTodos[i].archived == null){
                todolist.push(
                    {
                        id: userTodos[i].id,
                        title: userTodos[i].title,
                        created: helppers.transformDates(new Date(userTodos[i].created)),
                        finished: (userTodos[i].finished) ? helppers.transformDates(new Date(userTodos[i].finished)) : null,
                        status: userTodos[i].status,
                        user_id: userTodos[i].user_id,
                        task_id: userTodos[i].task_id,
                        candelete: (userTodos[i].task_assigned.length == 0) ? true : false
                    }
                )
            }
        }

        if(!req.user){
            res.render('error', {msg: 'Ocurrio un error al cargar el usuario'})
        }else{
            res.render('index', {user: req.user, userTasks: tasklist, userTodos: todolist, assigned: assigned})
        }
    },

    async archived(req, res){
        const userTodos = await dbConfig.TodoList.findAll({ 
            where: 
            {
                user_id: req.user.id,
                archived: 'yes'
            } 
        })
    },

    async asignTask(req,res){

        const tasklist = [], todolist = [], assigned = []
        const userTasks = await dbConfig.Task.findAll({ 
            where: 
            {
                user_id: req.user.id
            } 
        }),
            userTodos = await dbConfig.TodoList.findAll({ 
                include: {
                    association: 'task_assigned',
                    attributes: ['status', 'todolist_id']
                },
                where: 
                {
                    user_id: req.user.id,
                } 
            }),
            assignedTo = await dbConfig.Task_Assigned.findAll(
                {
                    where: {
                        assignedto: req.user.id
                    },
                    include:{
                        association: 'task_list_asigned'
                    }
                }
                )       
        
        for (let i = 0; i < assignedTo.length; i++) {
            assigned.push(
                {
                    id: assignedTo[i].id,
                    assignedby: assignedTo[i].assignedby,
                    acepted: assignedTo[i].acepted,
                    assignedto: assignedTo[i].assignedto,
                    task_list_asigned: {
                        id: assignedTo[i].task_list_asigned.id,
                        title: assignedTo[i].task_list_asigned.title,
                        created: helppers.transformDates(new Date(assignedTo[i].task_list_asigned.created)),
                        finished: (assignedTo[i].task_list_asigned.finished) ? helppers.transformDates(new Date(assignedTo[i].task_list_asigned.finished)) : null,
                        description: assignedTo[i].task_list_asigned.description,
                        priority: assignedTo[i].task_list_asigned.priority,
                        status: assignedTo[i].task_list_asigned.status,
                        deadline: helppers.transformDates(new Date(assignedTo[i].task_list_asigned.deadline)),
                        user_id: assignedTo[i].task_list_asigned.user_id
                    }
                }
            )
        }
        
        for (let i = 0; i < userTasks.length; i++) {
            if (userTasks[i].todolist_id == null) {
                tasklist.push(

                    {
                        id: userTasks[i].id,
                        title: userTasks[i].title,
                        created: helppers.transformDates(new Date(userTasks[i].created)),
                        finished: (userTasks[i].finished) ? helppers.transformDates(new Date(userTasks[i].finished)) : null,
                        description: userTasks[i].description,
                        priority: userTasks[i].priority,
                        status: userTasks[i].status,
                        deadline: helppers.transformDates(new Date(userTasks[i].deadline)),
                        user_id: userTasks[i].user_id
                    }
                )
            }
        }

        for (let i = 0; i < userTodos.length; i++) {
            if(userTodos[i].archived == 'not' || userTodos[i].archived == null){
                todolist.push(
                    {
                        id: userTodos[i].id,
                        title: userTodos[i].title,
                        created: helppers.transformDates(new Date(userTodos[i].created)),
                        finished: (userTodos[i].finished) ? helppers.transformDates(new Date(userTodos[i].finished)) : null,
                        status: userTodos[i].status,
                        user_id: userTodos[i].user_id,
                        task_id: userTodos[i].task_id,
                        candelete: (userTodos[i].task_assigned.length == 0) ? true : false
                    }
                )
            }
        }

        const existUser = await dbConfig.User.findOne(
            { 
                where: { 
                    email: {
                        [Op.eq]: req.query.user_email,
                        [Op.ne]: req.user.email 
                    }, 
                } 
            }
        )
        
        if(existUser){
            const axistTask = await dbConfig.Task_Assigned.findOne(
                { 
                    where: { 
                        assignedto: {
                            [Op.eq]: existUser.id,
                        },
                        task_id:{
                            [Op.eq]: req.query.task_id,
                        }
                    } 
                }
            )
        
            if(axistTask){
                return res.render('index', {user: req.user, userTasks: tasklist, userTodos: todolist, assigned: assigned, tareaRepetida: true})
            }

            const createTaskAssigned = await dbConfig.Task_Assigned.create({
                assignedby: req.user.id,
                assignedto: existUser.id,
                task_id: req.query.task_id
            })

            if(createTaskAssigned){
                return res.render('index', {user: req.user, userTasks: tasklist, userTodos: todolist, assigned: assigned, asignValido: true})
            }else{
                return res.render('index', {user: req.user, userTasks: tasklist, userTodos: todolist, assigned: assigned})
            }
        }else{
            return res.render('index', {user: req.user, userTasks: tasklist, userTodos: todolist, assigned: assigned, asignInvalido: true})
        }
    },

    logout(req,res){
        res.clearCookie('x-access-token')
        req.session.destroy()
        res.redirect('/')
    }
}