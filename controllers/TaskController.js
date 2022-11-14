const { dbConfig } = require('../database/db_con')

module.exports = {

    home(req, res){
        res.render('newTask', { user: req.user })
    },

    async create(req, res){
        const date = new Date(),
                [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()],
                [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()]
                
        const newTask = await dbConfig.Task.create({
            title: req.body.title,
            created: `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`,
            description: req.body.description,
            priority: req.body.priority,
            status: 'unresolved',
            deadline: req.body.deadline,
            user_id: req.body.user_id
        })

        if(newTask){
            res.redirect('/home')
        }else{
            res.render('error', {msg: 'Error Inesperado Al Crear La Tarea'})
        }
    },

    async delete(req,res){
        const task = dbConfig.Task.destroy({
            where: {
                id: req.params.id
            }
        })

        if(task){
            res.redirect('/home')
        }
    },

    async update(req,res){
        console.log(req.query)
        const task = dbConfig.Task.update(
            {
                status: req.query.status, 
                finished: (req.query.status == 'resolved') ? new Date() : null
            },
            {
                where: {
                    id: req.query.id
                }
            }
            )

        if(task){
            res.redirect('/home')
        }
    },
    

}