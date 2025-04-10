import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const ShortUrlModel = sequelize.define(
	'short_urls',
	{
		id_short_urls: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		url_id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			references: {
				model: 'urls',
				key: 'id_urls',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		slug: {
			type: DataTypes.STRING(16),
			allowNull: false,
			unique: true,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: 'short_urls',
		schema: 'Min-URL',
		timestamps: false,
	},
)

export const createShortUrl = async (data) => {
	const shortUrl = await ShortUrlModel.create(data)
	return shortUrl
}
