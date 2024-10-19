const userSchema = require('../Model/userModel')
const bcrypt = require('bcrypt')
const saltround = 10

const loadRegister = async (req, res) => {
    try {
        res.render('./User/userRegister.hbs')
    } catch (error) {
        res.status(400).send(error)
    }
}

const registerUser = async (req, res) => {
    const user = new userSchema(req.body)
    try {
        const { email, password } = req.body

        const user = await userSchema.findOne({ email })
        if (user) return res.render('./User/userRegister.hbs', { message: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, saltround)
        
        const newUser = new userSchema({
            email,
            password: hashedPassword
        })
        await newUser.save()
        res.render('./User/userLogin.hbs', { message: 'User Created Successfully' })
    } catch (error) {
        res.render('./User/userRegister.hbs', { message: 'Invalid Credentials' })
    }
}

const loadLogin = async (req, res) => {
    try {
        res.render('./User/userLogin.hbs')
    } catch (error) {
        res.status(400).send(error, 'Invalid Credentials')
        console.log('loadlogin controller error');
    }
}


const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.render('./User/userLogin.hbs', { message: 'User does not exist' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('./User/userLogin.hbs', { message: 'Password is incorrect' });
        }

        req.session.user = user._id
        req.session.role = 'user'  
        req.session.save(() => {
            res.redirect('/user/home')  
        })


        // req.session.user = true
        // res.redirect('/user/login?message=User Created Successfully');
        // res.redirect('/user/home');
    } catch (error) {
        res.status(400).send(error);
    }
}


const loadHome = async (req, res) => {
    console.log('loadhome controller');

    const user = await userSchema.findOne({ _id: req.session.user});
    const email = user.email
    console.log(email);
    console.log(req.session.user);
    
    try {
        res.render('./User/userHome.hbs', { email })
        console.log(email);
        
    } catch (error) {
        res.status(400).send(error)
        console.log(error);
    }
}

const logout = async (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error while logging out')
        }
        res.redirect('/user/login')  
    })

}




module.exports = {
    registerUser,
    loadRegister,
    loadLogin,
    userLogin,
    loadHome,
    logout
}
