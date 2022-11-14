'use strict'

const {Model} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Task_Assigned extends Model {
        static associate(models) {
            Task_Assigned.belongsTo(models.User, {as: 'task_asigned_user', foreignKey: 'assignedto'})
            Task_Assigned.belongsTo(models.Task, {as: 'task_list_asigned', foreignKey: 'task_id'})
        }
    }

    Task_Assigned.init(
    {
        assignedby: {
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        acepted: {
            type: DataTypes.ENUM('yes','not'),
            defaultValue: 'not'
        },
    }, 
    {
        sequelize,
        modelName: 'task_assigned',
    }
    )

    return Task_Assigned
}