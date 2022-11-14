const { dbConfig } = require('../database/db_con')

module.exports = {

    home(req, res){
        res.render('newTodo', { user: req.user })
    },

    async create(req, res){
        const date = new Date(),
                [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()],
                [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()]
        
        const newTodo = await dbConfig.TodoList.create({
            title: req.body.title,
            created: `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`,
            description: req.body.description,
            status: 'unresolved',
            user_id: req.body.user_id
        })

        if(newTodo){
            res.redirect('/home')
        }else{
            res.render('error', {msg: 'Error Inesperado Al Crear La Lista de Tareas'})
        }
    },

    //opcion ver de las listas de tareas
    async show(req,res){
        const showTodo = await dbConfig.TodoList.findByPk(
            req.params.id,
            {
                include: {
                    association: 'task_assigned',
                }
            }
            ),
            userTasks = await dbConfig.Task.findAll({ 
                where: 
                {
                    user_id: req.user.id
                } 
            }),
            taskAssigned = await dbConfig.Task.findAll(
                {
                    include: {
                        association: 'task_assigned',
                        attributes: ['id','assignedto']
                    },
                    where: {
                        user_id: req.user.id
                    }
                }
            )

        const tasks = []
        for (let i = 0; i < taskAssigned.length; i++) {
            if(taskAssigned[i].todolist_id == null){
                if(taskAssigned[i].task_assigned.length == 0){
                    tasks.push(
                        {
                            id: taskAssigned[i].id,
                            title: taskAssigned[i].title,
                            created: taskAssigned[i].created,
                            finished: taskAssigned[i].finished,
                            description: taskAssigned[i].description,
                            priority: taskAssigned[i].priority,
                            status: taskAssigned[i].status,
                            deadline: taskAssigned[i].deadline,
                            user_id: taskAssigned[i].user_id,
                            todolist_id: taskAssigned[i].todolist_id
                        }
                    ) 
                }
            }
        }

        function transformDates(date=null){
            if(date){
                const addZero = (num)=>
                {
                    return (num<10) ? '0'+num : num
                },
                rango = ()=>
                {
                    return (date.getHours()<12) ? 'AM' : 'PM'
                },
                hrs = addZero(date.getHours()),
                min = addZero(date.getMinutes()),
                sec = addZero(date.getSeconds()),
                dia = addZero(date.getDate()),
                mes = addZero(date.getMonth()),
                anno = date.getFullYear(),

                fecha = `${dia}/${mes}/${anno}`,
                hora = `${hrs}:${min}:${sec} ${rango()}`

                return fecha + " " + hora
            }else{
                return null
            }
        }

        function agregarTareas(task_assigned){
            const todos = []
            for (let i = 0; i < task_assigned.length; i++) {
                todos.push(
                    {
                        id: task_assigned[i].id,
                        title: task_assigned[i].title,
                        created: transformDates(new Date(task_assigned[i].created)),
                        finished: transformDates(new Date(task_assigned[i].finished)),
                        description: task_assigned[i].description,
                        priority: task_assigned[i].priority,
                        status: task_assigned[i].status,
                        deadline: transformDates(new Date(task_assigned[i].deadline)),
                        user_id: task_assigned[i].user_id,
                        todolist_id: task_assigned[i].todolist_id
                    }
                )
            }
            return todos
        }

        function completedTask(task){
            let numeroDeTareas = task.length
            let completas = 0

            for (let i = 0; i < task.length; i++) {
                if (task[i].status == 'resolved') {
                    completas++
                }
            }
            if(numeroDeTareas==completas){
                return true
            }else{
                return false
            }
        }

        const todoList =
            {
                id: showTodo.id,
                title: showTodo.title,
                created: transformDates(new Date(showTodo.created)),
                finished: transformDates(new Date(showTodo.finished)),
                status: showTodo.status,
                user_id: showTodo.user_id,
                task_assigned: Array.isArray(showTodo.task_assigned) ? agregarTareas(showTodo.task_assigned) : showTodo.task_assigned,
                completed: Array.isArray(showTodo.task_assigned) ? completedTask(showTodo.task_assigned) : false,
                archived: showTodo.archived
            }
        
        if(showTodo){
            res.render('todoShow', {todolist: todoList, user: req.user, tasklist: tasks})
        }else{
            res.render('error', {msg: 'Error al buscar la lista de tareas. Intenta nuevamente...'})
        }
    },

    async addtask(req,res){
        const showTask = await dbConfig.Task.findByPk(req.query.task_id)

        showTask.todolist_id = req.query.todo_id

        showTask.save()
        res.redirect(`/todolist/show/${req.query.todo_id}`)
    },

    async delete(req,res){
        const candelete = await dbConfig.TodoList.findByPk( req.params.id, 
            {
                attributes: ['id'],
                include: {
                    association: 'task_assigned'
                }
            }
        )
        if(candelete.task_assigned.length <= 0){
            const task = await dbConfig.TodoList.destroy({
                where: {
                    id: req.params.id
                }
            })
    
            if(task){
                res.redirect('/home')
            }
        }else{
            res.redirect('/home')
        }
        
    },

    async update(req,res){
        //comprobar que todas las tareas esten resueltas para poder cambiar el estado a resolved
        const todoUpdate = await dbConfig.TodoList.update(
            {
                status: req.query.status, 
                finished: (req.query.status == 'resolved') ? new Date() : null
            },
            {
                where: {
                    id: req.query.todo_id
                }
            }
            )

        if(todoUpdate){
            res.redirect('/home')
        }
    },

    async archivate(req,res){
        const todoUpdate = await dbConfig.TodoList.update(
            {
                archived: 'yes',
            },
            {
                where: {
                    id: req.params.id
                }
            }
            )

        if(todoUpdate){
            res.redirect('/archived')
        }
    },

    async archived(req,res){
        const todoArchived = await dbConfig.TodoList.findAll(
            {
                where: {
                    archived: 'yes'
                }
            }
            )

            function transformDates(date=null){
                if(date){
                    const addZero = (num)=>
                    {
                        return (num<10) ? '0'+num : num
                    },
                    rango = ()=>
                    {
                        return (date.getHours()<12) ? 'AM' : 'PM'
                    },
                    hrs = addZero(date.getHours()),
                    min = addZero(date.getMinutes()),
                    sec = addZero(date.getSeconds()),
                    dia = addZero(date.getDate()),
                    mes = addZero(date.getMonth()),
                    anno = date.getFullYear(),
    
                    fecha = `${dia}/${mes}/${anno}`,
                    hora = `${hrs}:${min}:${sec} ${rango()}`
    
                    return fecha + " " + hora
                }else{
                    return null
                }
            }
            const todolist = []
            for (let i = 0; i < todoArchived.length; i++) {
                todolist.push(
                    {
                        id: todoArchived[i].id,
                        title: todoArchived[i].title,
                        created: transformDates(new Date(todoArchived[i].created)),
                        finished: (todoArchived[i].finished) ? transformDates(new Date(todoArchived[i].finished)) : null,
                        status: todoArchived[i].status,
                        user_id: todoArchived[i].user_id,
                        task_id: todoArchived[i].task_id
                    }
                )
            }

        if(todoArchived){
            res.render('archived', {todolist: todolist, user: req.user})
        }else{
            res.render('error', {msg: 'Error al cargar las listas archivadas...'})
        }
    }
}