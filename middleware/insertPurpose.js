export const insertDirectPurpose = (req, _res, next) => {
	req.purpose = 'direct'
	next()
}

export const insertQrPurpose = (req, _res, next) => {
	req.purpose = 'qr'
	next()
}

export const insertApiPurpose = (req, _res, next) => {
	req.purpose = 'api'
	next()
}
