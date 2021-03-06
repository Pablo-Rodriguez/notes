
const Schema = require('../../base/schema')

module.exports = class NoteSchema extends Schema {
  static get NAME () { return 'note' }

  static properties (Sequelize) {
    return {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      body: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      tags: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        get () {
          return this.getDataValue('tags').split(',').map(tag => tag.trim())
        },
        set (val) {
          return this.setDataValue('tags', val.map(str => str.trim()).join(','))
        }
      }
    }
  }
}
