const crypto = require("crypto")
const { sqlLoader } = require('@prairielearn/prairielib')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const dbDriver = require('../dbDriver')

const sql = sqlLoader.loadSqlEquiv(__filename)


module.exports.setupPassport = (app) => {
	passport.use(new LocalStrategy((email, password, done) => {

			const params = {
					email
			};
	
			dbDriver.asyncQuery(sql.select_user, params).then( (results) => {
				if (results.rows.length === 1) {
					const user = results.rows[0];
					// Since dev/demo only, do the bare minimum
					const pwHash = crypto.createHash("sha256").update(password).digest("hex");
	
					// check password
					if (pwHash === user.password) {
	
						// keep everything but the hashed password in the session
						delete user.password;
	
						return done(null, user);
	
					} 
	
						return done(null, false, {message: "Incorrect password"});
					
	
				} 
					return done(null, false, 
						{message: `No unique user '${email}' (${results.rows.length})`});
				
			}).catch( (err) => {
				return done(err, false);
			});
		}
	));

	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user, done) => {
			done(null, user);
	});
	
	passport.deserializeUser((obj, done) => {
			done(null, obj);
	});
}
