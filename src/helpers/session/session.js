import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './session/session.sqlite3',
  define: {
    timestamps: false
  }
})

export const SceneWizard = sequelize.define('scene_wizard', {
  user_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: false },
  name: { type: DataTypes.STRING(50) },
  current_step_idx: { type: DataTypes.SMALLINT }
})

export const session = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true })
  } catch (error) {
    throw new Error(error.message)
  }
}