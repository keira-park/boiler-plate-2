import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_actions';

export default function Authentication(SpecificComponent, option, adminRoute = null) {
  // SpecificComponent { LandingPage }, option { null, true, false }, adminRoute
  // null => 아무나 출입이 가능한 페이지
  // true => 로그인한 유저만 출입이 가능한 페이지
  // false => 로그인한 유저는 출입 불가능한 페이지
  // adminRoute { true } => 관리자만 들어갈 수 있는 페이지

  function AuthenticationCheck(props) {

    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then(response => {
        console.log(response)

        // 로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push('/login')
          }
        } else {
          // 로그인 한 상태

          // adminRoute => for Admin, !response.payload.isAdmin => not Admin
          // 못 들어가게 막아줘야 함.
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push('/')
          } else {
            // 로그인한 유저가 출입 불가능한 페이지
            if (option === false)
              props.history.push('/')
          }
        }
      })
    }, [])

    return (
      <SpecificComponent /> // 해당 페이지를 뱉어냄.
    )
  }

  return AuthenticationCheck
}