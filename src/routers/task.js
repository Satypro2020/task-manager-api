const express = require('express')
const router = new express.Router()
const auth= require('../middleware/auth')
const Task = require('../models/tasks')


router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)
    //to ensure thata task created is associated with a user
    const task = new Task({
        ...req.body, //copies all the data related to the task along with the owner property
        owner:req.user._id
    })//notice the diff between line 8 and the above two lines...added the owner property
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=2
//GET /tasks?sortBy=createdAt_asc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort={}
    if (req.query.completed) {
        match.completed=req.query.completed==='true' 
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            
            
    
    }
    try {
          // const tasks=await Task.find({owner:req.user.id})
        await req.user.populate({
            path: 'tasks',
            match,            
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
    
            }
        }).execPopulate()
        res.send(req.user.tasks)//the commented line would work with req.tasks
    } catch (e) {
        res.status(500).send()
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id
    try {
        
        const task=await Task.findOne({_id, owner:req.user.id})
        
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})
router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOpertaion = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOpertaion) {
        return res.status(400).send({ error: 'Update not allowed' })

    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id })
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()


        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            res.status(404).send()

        }
        res.send(task)
    } catch (e) {
        res.status(400).send()
    }


})

router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
        if (!task) {
            res.status(404).send({ error: 'Invalid id' })
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports=router