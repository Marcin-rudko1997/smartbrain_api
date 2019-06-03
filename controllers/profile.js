const handleProfileGet = (db) => (req, res) => {
	const {id} = req.params;
	
	db('users').select('*').where({id})
	.then(user => {
		if(user.length) {
			res.json(user[0]);
		} else {
			res.status(400).json('not found');
		}
	})
	.catch(() => res.status(400).json('error getting user'));
}

const handleProfileUpdate = (req, res, db) => {
	const {id} = req.params;
	const {name, age, pet} = req.body.formInput;

	db('users')
		.where({id})
		.update({name})
		.then(response => {
			if(response) {
				res.json('success');
			} else {
				res.status(400).json('Unable to update');
			}
		})
		.catch(() => res.status(400).json('error updating the profile'));
}

module.exports = {
	handleProfileGet,
	handleProfileUpdate
}