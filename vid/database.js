if(process.env.NODE_ENV === 'production'){
	module.exports = {mongoURI:'mongodb://<gdgovinddaga6>:<Govind8686@@#>@ds145752.mlab.com:45752/jot-prod'}
}	else{
		module.exports = {mongoURI:'mongodb://localhost/jot'}
}
