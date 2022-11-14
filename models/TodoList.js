'use strict'

const {Model} = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class TodoList extends Model {

    static associate(models) {
      TodoList.hasMany(models.Task, { as:'task_assigned', foreignKey: 'todolist_id' })
      TodoList.belongsTo(models.User)
    }

  }

  TodoList.init(
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
      status: {
        type: DataTypes.ENUM('unresolved','resolving','resolved'),
        defaultValue: 'unresolved'
      },
      archived: {
        type: DataTypes.ENUM('yes', 'not'),
        defaultValue: 'not'
      }
    }, 
    {
      sequelize,
      modelName: 'todolist',
    })

  return TodoList
  
}