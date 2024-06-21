"use client";
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import React, { MutableRefObject, useRef, useState } from 'react'
import accountActivationApi from '../../../components/shared/api/accountActivationApi'
import flashMessage from '../../../components/shared/flashMessages'
// import ShowErrors, { ErrorMessageType } from '@/components/shared/errorMessages';

const initialState = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  // errors: {} as ErrorMessageType,
};

const New: NextPage = () => {
  const router = useRouter()
  const [state, setState] = useState(initialState)
  const myRef = useRef() as MutableRefObject<HTMLInputElement>
  // const [errors, setErrors] = useState<ErrorMessageType>({});

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const { email } = state

    accountActivationApi.create(
      {
        resend_activation_email: {
          email: email,
        }
      }
    ).then(response => {
      // if (response.user) {
      //   myRef.current.blur()
      //   setState({
      //     ...state,
      //     errors: {},
      //   });
      //   flashMessage(...response.flash as [message_type: string, message: string])
      //   router.push("/")
      //   // window.location.assign('https://mail.google.com/mail/u/0')  
      // }
      // if (response.errors) {
      //   myRef.current.blur()
      //   setState({
      //     ...state,
      //     errors: response.errors,
      //   });
      //   setErrors(response.errors)
      //   console.log('error1', response.errors)
      // }
      flashMessage('success', 'The activation email has been sent again, please check your email')
    })
    .catch(error => {
      // flashMessage("error", error.toString())
      // setErrors({
      //   "email": [
      //       "can't be blank",
      //       "is invalid"
      //   ],
      //   "password_confirmation": [
      //       "doesn't match Password"
      //   ]
    })
  }

  return (
    <>
      <h1>Resend Activation Email</h1>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <form
            className="new_user"
            id="new_user"
            action="/users"
            acceptCharset="UTF-8"
            method="post"
            onSubmit={handleSubmit}
          >
            {/* Uncomment below lines to show form error messages */}
            {/* {Object.keys(errors).length !== 0 &&
              <ShowErrors errorMessage={errors} />
            } */}

            <div className="mb-3">
              <label htmlFor="user_email" className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                id="user_email"
                value={state.email}
                onChange={handleChange}
              />
            </div>

            <input ref={myRef} type="submit" className="btn btn-primary" value="Resend activation email" data-disable-with="Resending..." />
          </form>
        </div>
      </div>
    </>
  )
}

export default New
