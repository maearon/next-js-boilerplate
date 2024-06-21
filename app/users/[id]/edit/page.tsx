"use client";
import Image from 'next/image'
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import userApi, { UserEdit } from '../../../../components/shared/api/userApi'
import errorMessage from '../../../../components/shared/errorMessages'
import flashMessage from '../../../../components/shared/flashMessages'
import TextError from '../../../../components/shared/TextError'

const initialValues = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  errors: [] as string[],
  phNumbers: ['']
}

const savedValues = {
  name: 'Example User',
  email: 'example@railstutorial.org',
  password: 'foobar',
  password_confirmation: 'foobar',
  errors: [] as string[],
  phNumbers: ['+84912915132','+84904272299']
}

interface MyFormValues {
  name: string
  email: string
  password: string
  password_confirmation: string
  errors: string[]
}

const useSafeRouter = () => {
  try {
    return useRouter();
  } catch (error) {
    // useRouter not available
    return null;
  }
};

const Edit = ({params}: {params: {id: string}}) => {
  const router = useSafeRouter();
  const id = params.id
  const [user, setUser] = useState({} as UserEdit)
  const [formValues, setFormValues] = useState(Object)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState([] as string[])
  const [gravatar, setGravatar] = useState('')
  const inputEl = useRef() as MutableRefObject<HTMLInputElement>

  const getUserInfo= useCallback(async () => { 
    userApi.edit(id as string
    ).then(response => {
      if (response.user) {
        setUser(response.user)
        initialValues.name = response.user.name
        initialValues.email = response.user.email
        setGravatar(response.gravatar)
      }
      if (response.flash) {
        flashMessage(...response.flash)
        router?.push('/')
      }
    })
    .catch(error => {
      console.log(error)
    })
  }, [id, router])

  useEffect(() => {
    getUserInfo()
  }, [getUserInfo])

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Required')
  })

  const onSubmit = async (values: MyFormValues, { setSubmitting, resetForm }: any) => {
    try {
      const response = await userApi.update(id, {
        user: {
          name: values.name,
          email: values.email,
          password: values.password,
          password_confirmation: values.password_confirmation,
        },
      });
      inputEl.current?.blur();
      if (response.flash_success) {
        flashMessage(...response.flash_success);
        getUserInfo();
      }
      if (response.error) {
        setErrors(response.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false); // Always set submitting to false regardless of success or failure
    }
  }

  return (
    <>
      <h1>Update your profile</h1>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <Form>
                {/* {formik.errors.length !== 0 && errorMessage(formik.errors)} */}

                <label htmlFor="user_name">Name</label>
                <Field
                  className="form-control"
                  type="text"
                  name="name"
                  id="user_name"
                />
                <ErrorMessage name="name" component={TextError} />

                <label htmlFor="user_email">Email</label>
                <Field
                  className="form-control"
                  type="email"
                  name="email"
                  id="user_email"
                />
                <ErrorMessage name="email" component={TextError} />

                <label htmlFor="user_password">Password</label>
                <Field
                  className="form-control"
                  type="password"
                  name="password"
                  id="user_password"
                />
                <ErrorMessage name="password" component={TextError} />

                <label htmlFor="user_password_confirmation">Confirmation</label>
                <Field
                  className="form-control"
                  type="password"
                  name="password_confirmation"
                  id="user_password_confirmation"
                />
                <ErrorMessage
                  name="password_confirmation"
                  component={TextError}
                />


                <input
                  ref={inputEl}
                  type="submit"
                  name="commit"
                  value={formik.isSubmitting ? 'Loading...' : 'Save changes'}
                  className="btn btn-primary mt-2"
                  data-disable-with="Save changes"
                  disabled={!formik.isValid || formik.isSubmitting}
                />
              </Form>
            )}
          </Formik>
          <div className="gravatar_edit mt-3">
            <Image
              className="gravatar"
              src={`https://secure.gravatar.com/avatar/${gravatar}?s=80`}
              alt={user.name}
              width={80}
              height={80}
            />
            <a
              href="https://gravatar.com/emails"
              target="_blank"
              rel="noopener noreferrer"
            >
              change
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Edit
