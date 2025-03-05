import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
} from 'sequelize-typescript'

@Table({ tableName: 'users', schema: 'Min-URL', underscored: true })
export class User extends Model<User> {
	@PrimaryKey
	@Column({
		type: DataType.STRING,
		unique: true,
		allowNull: true,
	})
	declare googleId?: string

	@Column({
		type: DataType.STRING,
		unique: true,
		allowNull: true,
	})
	declare githubId?: string

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: string

	@Column({ type: DataType.STRING, allowNull: false })
	declare email: string

	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	declare deleted: boolean

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

	@Column({ type: DataType.DATE, allowNull: true })
	declare deletedAt?: Date
}
