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
		.catch((err) => {
			console.log(err)
		})
})

router.post('/add', (req, res) => {
	let id = cassandra.types.uuid()
	let body = req.body
	body.status = false

	client.execute('INSERT INTO tasks (id, title, description, status) VALUES (?,?,?,?)',
		[id, body.title, body.description, body.status])
		.then(() => {
			res.redirect('/')
		})
		.catch((err) => {
			console.log(err)
		})	
})

router.get('/task/:id', (req, res) => {	
	let id = req.params.id
	client.execute('SELECT * FROM tasks WHERE id = ?', [id])
		.then((task) => {			
			let status = task.rows[0].status					
			status = !status
			client.execute('UPDATE tasks SET status = ? WHERE id = ?', [status, id])
			.then(() => {
				res.redirect('/')
			})
			.catch((err) => {
				console.log(err)
			})	
		})
		.catch((err) => {
			console.log(err)
		})		
})


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