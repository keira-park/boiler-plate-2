const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        maxlength: 50
    },
    email: {
        type: String, 
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// userSchema를 저장('save')하기 전에(pre) 암호화 function해준다.
userSchema.pre('save', function(next){
    var user = this; // this -> userSchema를 가리킴.

    // 모델 안에 'password' 속성이 변화할 때만 bcrypt를 이용해서 해시화해준다.
    if (user.isModified('password')) {
    // 비밀 번호를 암호화시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash // 해시된 비번으로 user.password를 바꿔준다.
                next()
            }) // user.password하면 json안에 있는 "12345" 가 나온다.
        })
    } else { // 비번을 바꾸는 게 아니라면 그냥 next를 해줘서 이 과정을 스킵한다.
        next() 
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 1234567 암호화된 비밀번호 "$2b$10$0kdtvYEiA0hNnKDOtJeepOAR9eXPnVyOQ0rZKNmM.UQB1Qjdr8zx."
    // 이미 암호화된 비밀번호를 복구할 수는 없으므로, plainPassword를 다시 같은 방식으로 해시화한 후 두 개를 비교해야 한다.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err),
        cb(null, isMatch) // true!
    })
}


userSchema.methods.generateToken = function(cb) {
    // jsonwebtoken을 이용해서 token을 생성하기
    var user = this; // this -> userSchema를 가리킴.

    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    /* user._id + 'secretToken' => token 둘을 합쳐서 토큰을 만듦.
    -> 'secretToken' -> user._id => secretToken을 넣으면 user._id가 나오도록.
    따라서 우리는 token을 가지고 user._id를 구한다. */

    user.token = token // token이 user.token에 들어감
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}


const User = mongoose.model('User', userSchema)

module.exports = {User}