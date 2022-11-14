const { dbConfig } = require('../database/db_con')

module.exports = {
    async accept(req, res){
        const taskAccept = await dbConfig.Task_Assigned.update(
            {
                acepted: 'yes'
            },
            {
                where: {
                    id: req.query.id
                }
            }
        )
    
        if(taskAccept){
            res.redirect('/home')
        }else{
            res.render('index', { acepted: true })
        }
    }
}