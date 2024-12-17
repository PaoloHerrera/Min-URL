import { Op } from 'sequelize'
import { UrlModel } from '../models/Url.js'
import { LIMITS_VALUES } from '../constants.js'

export const limitRequests = async (req, res, next) => {
  try {
    let ip = req.ip

    if (ip === '::1') { ip = process.env.LOCAL_IP }

    // Se toma el día actual y se setea la hora a medianoche
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const urlCount = await UrlModel.count({
      where: {
        ip_address: ip,
        created_at: {
          [Op.gte]: startOfDay // Mayor o igual a la medianoche de hoy
        }
      }
    })

    if (urlCount >= LIMITS_VALUES.limitShortUrlPerDay) {
      return res.status(429).json({
        message: `Limit of ${LIMITS_VALUES.limitShortUrlPerDay} URLs per day reached. Try again tomorrow.`
      })
    }

    // Si no se ha alcanzado el límite, pasa al siguiente middleware o controlador
    next()
  } catch (error) {
    console.error('Error en el middleware de límite de solicitudes:', error)
    res.status(500).json({
      message: 'Server error. Try again later.'
    })
  }
}
