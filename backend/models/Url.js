import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

export const UrlModel = sequelize.define('url', {
  id_url: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id_user: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'user',
      key: 'id_user'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  id_url_hash: {
    type: DataTypes.STRING(16),
    allowNull: true,
    unique: true
  },
  longurl: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shorturl: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  clicks: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  ip_address: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  region: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  timezone: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  latitude: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  longitude: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
},
{ timestamps: false })
