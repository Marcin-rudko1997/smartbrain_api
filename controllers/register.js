const handleRegister = (db, bcrypt) => (req, res) => {
	const {email, password, name} = req.body;
	if(!email || !password || !name) {
		return res.status(400).json('incorrect form submission');
	}

	var hash = bcrypt.hashSync(password);

	//Updating 2 tables at once, using transaction to accomplish this
	db.transaction(trx => {
		trx.insert({hash, email})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				email: email,
				name: name,
				joined: new Date(),
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
.catch(err => res.status(400).json('unable to register'));

}

module.exports = {
	handleRegister: handleRegister
}
