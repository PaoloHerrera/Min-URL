import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const QrCodeModel = sequelize.define(
	'qr_codes',
	{
		id_qr_codes: {
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
		foreground_color: {
			type: DataTypes.STRING(7),
			allowNull: false,
		},
		background_color: {
			type: DataTypes.STRING(7),
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{ tableName: 'qr_codes', schema: 'Min-URL', timestamps: false },
)

export const createQrCode = async (data) => {
	const qrCode = await QrCodeModel.create(data)
	return qrCode
}
