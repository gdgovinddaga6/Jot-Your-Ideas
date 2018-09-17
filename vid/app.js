const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const app = express();
const db = require('./database')
mongoose.Promise = global.Promise;


mongoose.connect(db.mongoURI,{
	

})
.then(() => console.log('MongoDB Connected...'))
.catch(err =>console.log('err'));

// app.use(function (req,res,next) {
// 	console.log(Date.now);
// 	req.name = 'Govind Daga';
// 	next();
// });

require('./models/Idea');

const Idea = mongoose.model('ideas');
//handler for middlewares
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine','handlebars');
//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//method override middleware
app.use(methodOverride('_method'));

//Index Route
app.get('/', (req,res) =>{
	//console.log(req.name);
	const title = 'Welcome';
	res.render('index', {
		title : title
	}); 

} );

app.get('/about',(req,res)=>{
	res.render('about');
});
//Idea Index page

app.get('/ideas',(req,res)=>{
	Idea.find({})
		.sort({date:'desc'})
		.then(ideas => {
			res.render('ideas/index',{
				ideas:ideas
			});
		});
});
// Add Idea Form
app.get('/ideas/add',(req,res)=>{
	res.render('ideas/add');
});
//Editing the Idea Form
app.get('/ideas/edit/:id',(req,res)=>{
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea =>{
		res.render('ideas/edit',{
			idea:idea
		});
	})
	
});

//form details
app.post('/ideas', (req,res)=>{
	//console.log(req.body);
	//res.send('OK');
	let errors = [];

	if(!req.body.title){
		errors.push({text:'Please add a title'});
	}
	if(!req.body.details){
		errors.push({text:'Please add a details'});
	}
	if(errors.length > 0)
	{
		res.render('ideas/add',{
			errors:errors,
			title: req.body.title,
			details: req.body.details			
		});
	} else
	{
		//res.send('Passed');
		const newUser ={
			title: req.body.title,
			details: req.body.details
		}
		new Idea(newUser).save().then(idea=>{
			res.redirect('/ideas'); 
		})
	}
});
//editing form process
app.put('/ideas/:id',(req,res)=>{
	//res.send("PUT");
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		//new values
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
			.then(idea => {
				res.redirect('/ideas');
			})
	});
});
// delete idea
app.delete("/ideas/:id",(req,res)=>{
//	res.send("delete");
	Idea.remove({_id: req.params.id})
	.then(()=> {
		res.redirect('/ideas');
	});
});
app.listen(port, () =>{
	console.log(`Server started on port ${port}`);

});

