const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth} = require('./middleware/auth');
const {User} = require('./models/User');

// application/x-www-form-urlencoded 이렇게 생긴 데이터를 분석해서 가져올 수 있게 한다.
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 타입으로 된 데이터를 파싱한다.
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/hello', (req, res) => res.send('Hello World!'))

app.post('/api/users/register', (req, res) => {
  // 회원가입할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  // User 모듈이 있으므로 그걸 가져와야 한다.
  const user = new User(req.body)
  // req.body 에 {id: "hello", password: "12345"} 이런 식으로 들어와있다.

  // User 모듈 정보를 넣어둔 user, user 모델을 저장
  // err가 있을 경우, json 형식으로 에러 메시지 리턴
  // err가 없이 성공할 경우, success: true json 형식으로 리턴
  user.save((err, userInfo) => {
    if (err) return res.json({success: false, err})
      return res.status(200).json({
        success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {

  // 요청된 이메일이 데이터 베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 요청된 이메일이 데이터 베이스에 있다면, 비밀 번호가 맞는 비번인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

      // 비밀번호까지 같다면 token을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, ...
        res.cookie("x_auth", user.token)
          .status(200)
          .json({loginSuccess: true, userId: user._id})
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {

  // 여기까지 왔다는 것은 auth 미들웨어를 에러 리턴 없이 잘 빠져 나왔다는 뜻,
  // Authentication is true
  res.status(200).json({
    _id: req.user._id,
    /* role 0 -> 일반 유저, role 0이 아니면 관리자 */
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
    /* 이렇게 응답을 받아오면 어떤 페이지에서든지 유저 정보를 쓸 수 있어서 편리 */
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" } /* 토큰을 null로 바꿔준다 */
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
      success: true
      })
    })
})

const port = 5000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))