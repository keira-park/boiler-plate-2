import React, { useState } from 'react'
import { registerUser } from '../../../_actions/user_actions'
import { useDispatch } from 'react-redux'
// import Axios from 'axios';

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("")
  const [Name, setName] = useState("")
  const [Password, setPassword] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault(); /* submit 버튼 누를 때마다 새로고침 되는 것을 막아줌 */

    if (Password !== ConfirmPassword) {
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
    }

    // console.log('Email', Email)
    // console.log('Password', Password)
    let body = {
      email: Email,
      password: Password,
      name: Name
    }

    /* 비번과 비밀번호 확인이 일치하면, body 객체에 내용을 주고나서
    로그인 페이지로 이동 */
    dispatch(registerUser(body))
      .then(response => {
        if (response.payload.success) {
          props.history.push('/login');
        } else {
          alert("Failed to sign up")
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

        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>ConfirmPassword</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

        <br />
        <button type="submit">
          회원 가입
        </button>
      </form>
    </div>
  )
}

export default RegisterPage;
