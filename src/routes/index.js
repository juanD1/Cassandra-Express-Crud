//Dependencies
const express = require('express')
const router = express.Router()
const cassandra = require('cassandra-driver')

//Conect to the clustes
const client = new cassandra.Client({contactPoints:['127.0.0.1'], keyspace: 'crud_example'})

router.get('/', (req, res) => {
	client.execute('SELECT * FROM tasks')
		.then((tasks) => {			
			// res.json(tasks.rows)			
			res.render('index', {
				title: 'CRUD With Cassandra',
				tasks: tasks.rows			
			})			
		})
})

// router.get('/', (req, res) => {
// 	model.find({}, (err, tasks) => {		
// 		if (err) throw err		
// 		res.render('index', {
// 			title: 'CRUD',			
// 			tasks: [tasks]
// 		})		
// 	})
// })

// router.post('/add', (req, res) => {
// 	let body = req.body
// 	body.status = false

// 	model.create(body, (err, tasks) => {
// 		if(err) throw err
// 		res.redirect('/')
// 	})
// })

// router.get('/task/:id', (req, res) => {
// 	let id = req.params.id
// 	model.findById(id)
// 		.then((task) => {
// 			// res.json(task)
// 			task.status = !task.status
// 			task.save()
// 			res.redirect('/')
// 		})
// 		.catch((err) => {
// 			console.log(err)
// 		})		
// })


// router.get('/edit/:id', (req, res) => {
// 	let id = req.params.id
// 	let body = req.body
// 	model.findById(id)
// 	.then((task) => {
// 		res.render('edit', {
// 			title: 'CRUD',
// 			task: task
// 		})
// 	})			
// 	.catch((err) => {
// 		console.log(err)
// 	})
// })

// router.post('/update/:id', (req, res) => {
// 	let id = req.params.id
// 	let body = req.body
// 	model.findByIdAndUpdate(id, body)
// 	.then(() => {				
// 		res.redirect('/')
// 	})
// 	.catch((err) => {
// 		console.log(err)
// 	})		
// })

// router.get('/delete/:id', (req, res) => {
// 	let id = req.params.id
// 	model.remove({_id: id})
// 		.then((task) =>{
// 			res.redirect('/')
// 		})
// 		.catch((err) => {
// 			console.log(err)
// 		})
// })

module.exports = router