const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '666d3daeae7c4f6dbc118e59adc520f0'
});

const handleImage = (db) => (req, res) => {
	const {id} = req.body;
	
	db('users').where({id})
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries'));
}

const handleApiCall = (req, res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL,
      req.body.input)
	.then(data => {
		res.json(data);
	})
	.catch(err => res.status(400).json('Unable to work with an API'));
}

module.exports = {
	handleImage,
	handleApiCall
}