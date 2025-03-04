import { User } from './User.js'
import { Url } from './Url.js'
import { LogUrl } from './LogUrl.js'

User.hasMany(Url, { foreignKey: 'user_id' })
Url.belongsTo(User, { foreignKey: 'user_id' })

Url.hasMany(LogUrl, { foreignKey: 'url_id' })
LogUrl.belongsTo(Url, { foreignKey: 'url_id' })

export { User, Url, LogUrl }
