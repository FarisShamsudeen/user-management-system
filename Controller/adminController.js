const adminModel = require('../Model/adminModel')
const bcrypt = require('bcrypt')
const saltround = 10
const userModel = require('../Model/userModel')


const loadLogin = async (req, res) => {
    try {
        res.render('./Admin/adminLogin.hbs')
    } catch (error) {
        res.status(400).send(error, 'Invalid Credentials')
        console.log('admin loadlogin controller error');
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.render('./Admin/adminLogin.hbs', { message: 'Admin does not exist' });
        }


        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('./Admin/adminLogin.hbs', { message: 'Password is incorrect' });
        }

        req.session.admin = admin._id
        req.session.role = 'admin' 
        req.session.save(() => {
            res.redirect('/admin/dashboard')  
        })



    } catch (error) {
        res.send('Invalid Credentials')
        console.log('admin loadlogin controller error');
    }
}

const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin
        if (!admin) return res.redirect('/admin/login')

        const users = await userModel.find()
        res.render('./Admin/adminHome.hbs', { users })

    } catch (error) {
        res.status(400).send(error, 'Invalid Credentials')
        console.log('admin loadDashboard controller error');
    }
}

const searchUsers = async (req, res) => {
    try {
        const { email } = req.query
        const users = await userModel.find({ email: { $regex: email, $options: 'i' } })
        res.render('./Admin/adminHome.hbs', { users })

    } catch (error) {
        res.send('something went wrong in searchUsers controller')
        console.log('admin searchUsers controller error');
    }
}


const editUser = async (req, res) => {
    try {
        const { email, password, id } = req.body
        const existingUser = await userModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } })
        if (existingUser && existingUser._id.toString() !== id) return res.render('./Admin/adminHome.hbs', { users: [], message: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, saltround)
        const user = await userModel.findOneAndUpdate({ _id: id }, { $set: { email, password: hashedPassword } })

        res.redirect('/admin/dashboard')

    } catch (error) {
        res.status(400).send(error, 'Invalid Credentials')
        console.log('admin editUser controller error');
    }
}


const deleteUser = async (req, res) => {
    try {

        const { id } = req.params
        console.log(id);
        const user = await userModel.findOneAndDelete({ _id: id })
        res.redirect('/admin/dashboard')

    } catch (error) {
        res.status(400).send(error, 'Invalid Credentials')
        console.log('admin deleteUser controller error');
    }
}

const addUser = async (req, res) => {
    try {

        const { email, password } = req.body
        console.log(email, password);
        const checkUser = await userModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } })
        if (checkUser) return res.render('./Admin/adminHome.hbs', { message: 'User Already Exists' })

        const hashedPassword = await bcrypt.hash(password, saltround)
        const user = new userModel({ email, password: hashedPassword })
        await user.save()
        res.redirect('/admin/dashboard')

    } catch (error) {
        res.send('addUser Error')
        console.log('admin addUser controller error');
    }
}

const logout = async (req, res) => {
    // req.session.admin = null
    // res.redirect('/admin/login')

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error while logging out')
        }
        res.redirect('/admin/login')  
    })
}

module.exports = {
    loadLogin,
    adminLogin,
    loadDashboard,
    editUser,
    deleteUser,
    addUser,
    logout,
    searchUsers
}