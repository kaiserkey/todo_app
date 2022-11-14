'use strict'

const {Model} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {

    static associate(models) {
      Task.belongsTo(models.TodoList)
      Task.belongsTo(models.User)
      Task.hasMany(models.Task_Assigned, {as: 'task_assigned', foreignKey: 'task_id'})
    }

  }

  Task.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false
      },
      finished: {
        type: DataTypes.DATE,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      priority: {
        type: DataTypes.ENUM('short','half','high'),
        defaultValue: 'short'
      },
      status: {
        type: DataTypes.ENUM('unresolved','resolving','resolved'),
        defaultValue: 'unresolved'
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, 
    {
      sequelize,
      modelName: 'task',
    })

  return Task

}
