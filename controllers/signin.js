const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URI);

const signToken = email => {
	const jwtPayload = {email};
	//Put it into env variable later
	return jwt.sign(jwtPayload, 'JWT_SECRET');
}

const setToken = (token, id) => {
	return Promise.resolve(redisClient.set(token, id));
}

const createSessions = user => {
	const {email, id} = user;
	const token = signToken(email);
	return setToken(token, id)
		.then(() => {
			return {success: 'true', userId: id, token, user};
		})
		.catch(console.log)
}

const checkCredentials = (db, bcrypt, req, res) => {
	const {password, email} = req.body;
	if(!email || !password) {
		return Promise.reject('incorrect form submission');
	}
	return db.select('email', 'hash').from('login')
	.where('email', '=', email)
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if(isValid) {
			return db.select('*').from('users')
			.where('email', '=', email)
			.then(user => user[0])
			.catch(() => Promise.reject('unable to get a user'));
		}
		else {
			return Promise.reject('wrong credentials');
		}
	})
	.catch(() => Promise.reject('wrong credentials'));
	
}

const getAuthTokenId = (req, res) => {
	const {authorization} = req.headers;

	return redisClient.get(authorization, (err, reply) => {
		if(err || !reply) {
			return res.status(401).send('Unauthorized');
		}
		return res.json({id: reply});
	})
}







const signinAuthentication = (db, bcrypt) => (req, res) => {
	const {authorization} = req.headers;

	return authorization ? getAuthTokenId(req, res) :
		checkCredentials(db, bcrypt, req, res)
			.then(data => data.id && data.email ? createSessions(data) : Promise.reject(data))
			.then(session => res.json(session))
			.catch(err => res.status(400).json(err)); 

}

module.exports = {
	signinAuthentication: signinAuthentication,
	redisClient: redisClient
}