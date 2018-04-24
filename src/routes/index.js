//Dependencies
const express = require('express')
const router = express.Router()
const cassandra = require('cassandra-driver')

//Conect to the clustes
const client = new cassandra.Client({contactPoints:['127.0.0.1'], keyspace: 'crud_example'})

//Load all tasks
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
//Add task
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
//Edit state of task
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
//Load task for after edit
router.get('/edit/:id', (req, res) => {
	let id = req.params.id
	let body = req.body
	client.execute('SELECT * FROM tasks WHERE id = ?', [id])	
	.then((task) => {
		res.render('edit', {
			title: 'CRUD',
			task: task.rows[0]
		})
	})			
	.catch((err) => {
		console.log(err)
	})
})
//Edit task
router.post('/update/:id', (req, res) => {
	let id = req.params.id
	let body = req.body
	client.execute('UPDATE tasks SET title = ?, description = ? WHERE id = ?',
	[body.title, body.description, id])
	.then(() => {				
		res.redirect('/')
	})
	.catch((err) => {
		console.log(err)
	})		
})
//Delete task
router.get('/delete/:id', (req, res) => {
	let id = req.params.id
	client.execute('DELETE FROM tasks WHERE id = ?', [id])
		.then((task) =>{
			res.redirect('/')
		})
		.catch((err) => {
			console.log(err)
		})
})

module.exports = router