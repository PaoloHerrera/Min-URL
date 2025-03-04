import { Router } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../models/User.js'
import { handleUrlErrors } from '../middleware/urlMiddlewares.js'

const routesPassport = Router()

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		async (_accessToken, _refreshToken, profile, done) => {
			try {
				const user = await User.findOne({ where: { google_id: profile.id } })
				if (user) {
					return done(null, user)
				}

				const newUser = await User.create({
					google_id: profile.id,
					name: profile.displayName,
					email: profile.emails[0].value,
				})

				return done(null, newUser)
			} catch (error) {
				return done(error)
			}
		},
	),
)
passport.serializeUser((user, done) => {
	done(null, user.id_users)
})
passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id)
	done(null, user)
})

routesPassport.get(
	'/auth/google',
	passport.authenticate('google', { scope: ['profile', 'email'] }),
)
routesPassport.get(
	'/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	(_req, res) => {
		res.redirect(process.env.REDIRECT_URL)
	},
)

routesPassport.use(handleUrlErrors)

export { routesPassport }
