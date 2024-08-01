"use client";
import { NextPage } from 'next'
import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import Pagination from 'react-js-pagination'
import Skeleton from 'react-loading-skeleton'
import micropostApi, { CreateResponse, ListResponse, Micropost } from '../components/shared/api/micropostApi'
import errorMessage from '../components/shared/errorMessages'
import flashMessage from '../components/shared/flashMessages'
import { useAppSelector } from '../redux/hooks'
import { fetchUser, selectUser } from '../redux/session/sessionSlice'
import { useDispatch } from 'react-redux';
// Alt + Shift + O

// interface Props {
//   userData: UserState;
// }

const Home: NextPage = () => {
  const [page, setPage] = useState(1)
  const [feed_items, setFeedItems] = useState([] as Micropost[])
  const [total_count, setTotalCount] = useState(1)
  const [following, setFollowing] = useState(Number)
  const [followers, setFollowers] = useState(Number)
  const [micropost, setMicropost] = useState(Number)
  const [gravatar, setGavatar] = useState(String)
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imageName, setImageName] = useState('')
  const inputEl = useRef() as MutableRefObject<HTMLInputElement>
  const inputImage = useRef() as MutableRefObject<HTMLInputElement>
  const [errors, setErrors] = useState([] as string[])
  const userData = useAppSelector(selectUser)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const setFeeds= useCallback(async () => { 
    micropostApi.getAll({page: page}
    ).then((response: ListResponse<Micropost>) => {
      if (response.feed_items) {
        setFeedItems(response.feed_items)
        setTotalCount(response.total_count)
        setFollowing(response.following)
        setFollowers(response.followers)
        setMicropost(response.micropost)
        setGavatar(response.gravatar)
      } else {
        setFeedItems([])
      }
    })
    .catch((error: any) => {
      console.log(error)
    })
  }, [page])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await dispatch(fetchUser());
      } catch (error) {
        flashMessage('error', 'Failed to fetch user')
      } finally {
        setFeeds();
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, setFeeds, userData.loggedIn])

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setPage(pageNumber)
  }

  const handleContentInput = (e: any) => {
    setContent(e.target.value)
  }

  const handleImageInput = (e: any) => {
    if (e.target.files[0]) {
      const size_in_megabytes = e.target.files[0].size/1024/1024
      if (size_in_megabytes > 512) {
        alert("Maximum file size is 512MB. Please choose a smaller file.")
        setImage(null)
        e.target.value = null
      } else {
        setImage(e.target.files[0])
        setImageName(e.target.files[0].name)
      }
    }
  }

  const handleSubmit = (e: any) => {
      const formData2 = new FormData()
      formData2.append('micropost[content]',
        content
      )
      if (image) {
      formData2.append('micropost[image]',
        image || new Blob,
        imageName
      )
      }

      var BASE_URL = ''
      if (process.env.NODE_ENV === 'development') {
        BASE_URL = 'http://localhost:3001/api'
      } else if (process.env.NODE_ENV === 'production') {
        BASE_URL = 'https://ruby-rails-boilerplate-3s9t.onrender.com/api'
      }

      fetch(BASE_URL+`/microposts`, {
        method: "POST",
        body: formData2,
        credentials: 'include',
        headers: {
          'Authorization': localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined' ?
          `Bearer ${localStorage.getItem('token')} ${localStorage.getItem('remember_token')}` :
          `Bearer ${sessionStorage.getItem('token')} ${sessionStorage.getItem('remember_token')}`
        }
      })
      .then((response: any) => response.json().then((data: CreateResponse) => {
        
        if (data.flash) {
          inputEl.current.blur()
          flashMessage(...data.flash)
          setContent('')
          setImage(null)
          inputImage.current.value = ''
          setErrors([])
          setFeeds()
        }
        if (data.error) {
          inputEl.current.blur()
          setErrors(data.error)
        }

      })
      )

    e.preventDefault()
  }

  const removeMicropost = (micropostid: number) => {
    let sure = window.confirm("You sure?")
    if (sure === true) {
      micropostApi.remove(micropostid
      ).then(response => {
        if (response.flash) {
          flashMessage(...response.flash)
          setFeeds()
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
    }
  }

  return loading ? (
    <>
      <Skeleton height={304} />
      <Skeleton circle={true} height={60} width={60} />
    </>
  ) : userData.error ? (
    <h2>{userData.error}</h2>
  ) : userData.value.email ? (
    <div className="row">
      <aside className="col-md-4">
        <section className="user_info">
          <Image
            className="gravatar"
            src={`https://secure.gravatar.com/avatar/${gravatar}?s=50`}
            alt={userData.value.name}
            width={50}
            height={50}
            priority
          />
          <h1>{userData.value.name}</h1>
          <span><Link href={`/users/${userData.value.id}`}>view my profile</Link></span>
          <span>{micropost} micropost{micropost !== 1 ? 's' : ''}</span>
        </section>

        <section className="stats">
          <div className="stats">
            <Link href={`/users/${userData.value.id}/following`}>
              <strong id="following" className="stat">{following}</strong> following
            </Link>
            <Link href={`/users/${userData.value.id}/followers`}>
              <strong id="followers" className="stat">{followers}</strong> followers
            </Link>
          </div>
        </section>

        <section className="micropost_form">
          <form
            encType="multipart/form-data"
            action="/microposts"
            acceptCharset="UTF-8"
            method="post"
            onSubmit={handleSubmit}
          >
            {errors.length !== 0 && errorMessage(errors)}
            <div className="field">
              <textarea
                placeholder="Compose new micropost..."
                name="micropost[content]"
                id="micropost_content"
                value={content}
                onChange={handleContentInput}
                className="form-control"
              ></textarea>
            </div>
            <input
              ref={inputEl}
              type="submit"
              name="commit"
              value="Post"
              className="btn btn-primary"
              data-disable-with="Post"
            />
            <span className="image">
              <input
                ref={inputImage}
                accept="image/jpeg,image/gif,image/png"
                type="file"
                name="micropost[image]"
                id="micropost_image"
                onChange={handleImageInput}
                className="form-control-file"
              />
            </span>
          </form>
        </section>
      </aside>

      <div className="col-md-8">
        <h3>Micropost Feed</h3>
        {feed_items.length > 0 && (
          <>
            <ol className="microposts list-unstyled">
              {feed_items.map((i: any, t) => (
                <li key={t} id={`micropost-${i.id}`} className="media mb-3">
                  <Link href={`/users/${i.user_id}`}>
                    <Image
                      className="mr-3 gravatar"
                      src={`https://secure.gravatar.com/avatar/${i.gravatar_id}?s=${i.size}`}
                      alt={i.user_name}
                      width={i.size}
                      height={i.size}
                      priority
                    />
                  </Link>
                  <div className="media-body">
                    <span className="user">
                      <Link href={`/users/${i.user_id}`}>{i.user_name}</Link>
                    </span>
                    <span className="content">
                      {i.content}
                      {i.image && (
                        <Image
                          src={i.image}
                          alt="Example User"
                          width={0}
                          height={0}
                          sizes="100vw"
                          style={{ width: '100%', height: 'auto' }}
                          priority
                        />
                      )}
                    </span>
                    <span className="timestamp">
                      {'Posted ' + i.timestamp + ' ago. '}
                      {userData.value.id === i.user_id && (
                        <Link href="#/microposts/${i.id}" onClick={() => removeMicropost(i.id)}>
                          delete
                        </Link>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            <Pagination
              activePage={page}
              itemsCountPerPage={5}
              totalItemsCount={total_count}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  ) : (
    <>
      <div className="center jumbotron">
        <h1>Welcome to the Sample App</h1>
        <h2>
          This is the home page for the <Link href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">NextJS Tutorial</Link> sample application.
        </h2>
        <Link href="/signup" className="btn btn-lg btn-primary">Sign up now!</Link>
      </div>
      <Link href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
      </Link>
    </>
  )
}

export default Home

// export const getServerSideProps: GetServerSideProps = async () => {
//   try {
//     const userData = useAppSelector(selectUser);
//     return { userData }
//   } catch {
//     return {
//       props: {}
//     }
//   }
// }
