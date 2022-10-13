const router = require("express").Router()
const auth = require("../middleware/auth")
const Task = require("../models/task.model")

// send the task which user_id corresponds to the user's id
router.get("/get/:user_id",auth,  async (req, res) => {
    try {

        // Get the user's id
        const taskId = req.params.user_id
        
        // find the task with the same user id
        const task = await Task.find({user_id: taskId})
        res.json(task)  
    }
    catch(err) {
        return res.status(500).json({error: err.message})
    }
})

router.post("/add", auth , async (req, res) => {
    try {
        let { name, user_id } = req.body 
        let newTask = new Task({
            name: name,
            user_id: user_id, 
            completed: false,
        })
        const saved = await newTask.save()
        res.json(saved)
    }
    catch(err) {
        return res.status(500).json({error: err.message})
    }
})
router.delete("/delete", auth, async (req, res) => {

    try {
        const {_id} = req.body
        if (!_id) return res.status(400).json({message: "No Task id detected."})

        const deleted = await Task.findByIdAndDelete(_id)

        res.json(deleted)

    }catch (e) {
        return res.status(500).json({error: e.message})
    }
})

router.put("/update", auth, async (req, res) => {

    try {
        console.log(req.body)
        const {_id, completed} = req.body
        if (!_id) return res.status(400).json({message: "No Task id detected."})

        const updated = await Task.updateOne( {_id: _id},{completed: completed})
        res.json(updated)

    }catch (e) {
        return res.status(500).json({error: e.message})
    }
})



module.exports = router
