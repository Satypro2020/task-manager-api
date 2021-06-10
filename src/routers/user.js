const express = require('express')
const User = require('../models/users')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp=require('sharp')
const router = new express.Router()
const { sendWelcomeMail, sendGoodbyeMail}=require ('../emails/accounts')


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeMail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }


    // user.save().then(() => {
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)

    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //this will call whatever is defined on userSchema.statics.findByCredentials defined in the models file of users
        const token = await user.generateAuthToken()
        //used small case user coz we need to work on an instance of the user and not the collection as a whole to generate a token
        res.send({ user:user, token: token })//could use({user,token}) as shorthand
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


const upload = multer({
    // dest: 'avatars',not required anymore coz we dont wanna store all the user pics on local machine    
    limits: {
        fileSize: 1000000
        
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return cb(new Error('Upload only jpg,jpeg, png'))
        }
        cb(undefined,true)
    }
})
/////
// POST /users/me/avatar
router.post('/users/me/avatar',auth, upload.single('avatar'), async(req, res) => {
const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    // req.user.avatar = req.file.buffer
    req.user.avatar =buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
   res.status(400).send({error:error.message})
})

//DELETE /user/me/avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})
//since we are passing auth, we are already authenticated, no need to fetch in user data
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
        
       
        
    } catch (e) {
        res.status(500).send()
    }
})

//to add the middleware to a request, we just pass the middleware file to the request
//only when the middlware calls the next() will the request handler run
router.get('/users/me',auth, async (req, res) => {

   res.send(req.user) 
    // User.find({}).then((users) => {
    //      res.send(users)
    // }).catch((e) => {
    //      res.status(500).send()
    //  })
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         } res.send(user)
//     } catch (e) {
//         res.status(404).send()
//     }
//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })
//////
//the following updates the info of the logged in user
router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOpertaion = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOpertaion) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }// to let the user know that an originally non existent property is being updated which isn't possible
   
    try {
        
        
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
       // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // if (!user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)//we are using auth, therefore we have access to req.user and the _id object on it
        // if (!user) {
        //     res.status(404).send({ error: 'Invalid id' })
        // }
        
        await req.user.remove()
        sendGoodbyeMail(req.user.email, req.user.name)//same as above commented out part
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router


