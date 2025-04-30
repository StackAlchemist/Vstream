import mongoose from 'mongoose';
import {isEmail} from 'validator'
import bcrypt from 'bcrypt'

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true
    },
},{timestamps: true})

adminSchema.pre('save', async function (next){
    const salt: string = await bcrypt.genSalt()
    const hash: string = await bcrypt.hash(this.password, salt)
    this.password = hash
    next()
})

adminSchema.post('save', async function (doc: Object , next: Function) {
    console.log('admin created', doc)
    next()
})

adminSchema.statics.login = async function (email:string, password:string) {
    const user = await this.findOne({email})
    if(user){
        const auth =  await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('Wrong Credentials')
    }throw Error('I know not this man')
}

const Directors = mongoose.model('directors', adminSchema)
export default Directors