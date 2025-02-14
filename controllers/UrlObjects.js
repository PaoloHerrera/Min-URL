export const createUrlObject = (req, slug) => ({
	longurl: req.body.originalUrl,
	id_url_hash: crypto.randomUUID(),
	slug,
	purpose: req.purpose,
	ip_address: req.originalIp,
	...extractGeoData(req.geo),
})

export const createLogUrlObject = (req, url) => ({
	url_id_url: url.dataValues.id_url,
	id_logurl_hash: crypto.randomUUID(),
	ip_address: req.originalIp,
	...extractGeoData(req.geo),
})

export const extractGeoData = (geo) => ({
	country: geo.country,
	region: geo.region,
	timezone: geo.timezone,
	city: geo.city,
	latitude: geo.ll[0],
	longitude: geo.ll[1],
})
