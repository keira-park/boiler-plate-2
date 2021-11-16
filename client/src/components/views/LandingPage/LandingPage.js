import React, { useEffect } from 'react'
import axios from 'axios';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';

function LandingPage(props) {

  useEffect(() => {
    axios.get('/api/hello')
      .then(response => { console.log(response) })
  }, [])

  const onClickHandler = () => {
    axios.get('/api/users/logout')
      .then(response => {
        // console.log(response.data)
        if (response.data.success) {
          /* 로그인 페이지로 이동 */
          props.history.push('/login')
        } else { alert('로그아웃에 실패했습니다.') }
      })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'
      , width: '100%', height: '100vh'
    }}>
      <h2>시작 페이지</h2>
      <>
        <Button type="primary" onClick={onClickHandler}>로그아웃</Button>
      </>
    </div>
  )
}

export default withRouter(LandingPage);