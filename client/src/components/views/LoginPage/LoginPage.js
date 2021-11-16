// import { Axios } from 'axios'
import React, { useState } from 'react'
import { loginUser } from '../../../_actions/user_actions'
import { useDispatch } from 'react-redux'
// import { response } from 'express'; 프론트에서는 백의 express에서 import해올 수 없음


function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault(); /* submit 버튼 누를 때마다 새로고침 되는 것을 막아줌 */
    // console.log('Email', Email)
    // console.log('Password', Password)

    let body = {
      email: Email,
      password: Password
    }

    /* 처음 페이지로 이동 */
    dispatch(loginUser(body))
      .then(response => {
        if (response.payload.loginSuccess) { /* if true, since loginSuccess = true */
          // 리액트에서 페이지를 이동할 때는 props.history.push
          /* LandingPage로 이동 */
          props.history.push('/');
        }
      })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100vh'
    }}>
      <form style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button>
            Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage;