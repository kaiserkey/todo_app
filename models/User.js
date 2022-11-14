'use strict'

const {Model} = require('sequelize')


module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    static associate(models) {
      User.hasMany(models.TodoList, { as: 'user_listas', foreignKey: 'user_id' })
      User.hasMany(models.Task, { as: 'user_tareas', foreignKey: 'user_id' })
      User.hasMany(models.Task_Assigned, {as: 'user_task_assigned', foreignKey: 'assignedto'})
    }

  }

  User.init(
    {
      nick_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, 
    {
      sequelize,
      modelName: 'user',
    })

  return User

}