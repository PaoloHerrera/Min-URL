import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
} from 'sequelize-typescript'

@Table({ tableName: 'refresh_tokens', schema: 'Min-URL', underscored: true })
export class RefreshToken extends Model<RefreshToken> {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	declare idRefreshTokens: number

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	declare userId: number

	@Column({ type: DataType.STRING, allowNull: false })
	declare refreshToken: string

	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	declare expired: boolean

	@Column({
		type: DataType.DATE,
	})
	declare expiresAt: Date

	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
	})
	declare createdAt: Date

	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
	})
	declare updatedAt: Date

	@Column({
		type: DataType.DATE,
	})
	declare expiredAt: Date
}
