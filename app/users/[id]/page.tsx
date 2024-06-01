"use client";
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import Pagination from 'react-js-pagination'
import { useAppSelector } from '../../../redux/hooks'
import { selectUser } from '../../../redux/session/sessionSlice'
import micropostApi, { Micropost } from '../../../components/shared/api/micropostApi'
import relationshipApi from '../../../components/shared/api/relationshipApi'
import userApi from '../../../components/shared/api/userApi'
import flashMessage from '../../../components/shared/flashMessages'
import FollowForm from '../../../components/users/FollowForm'
import Link from 'next/link'

const Show = ({params}: {params: {id: string}}) => {
  const [user, setUser] = useState(Object)
  const [microposts, setMicroposts] = useState([] as Micropost[])
  const [id_relationships, setIdRelationships] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total_count, setTotalCount] = useState(1)
  const current_user = useAppSelector(selectUser)
  const router = useRouter()
  const id = params.id
  
  const setWall= useCallback(async () => { 
    userApi.show(params.id, {page: page}
    ).then(response => {
      if (response.microposts) {
        setUser(current_user.value)
        setMicroposts(response.microposts)
        setTotalCount(response.total_count)
        setIdRelationships(id)
      } else {
        setUser({})
        setMicroposts([])
      }
    })
    .catch(error => {
      console.log(error)
    })
  }, [page, id])

  useEffect(() => {
    if (id) { setWall() }
  }, [setWall, id])

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setPage(pageNumber)
  }

  const handleFollow = (e: { preventDefault: () => void }) => {
    relationshipApi.create({followed_id: id}
    ).then(response => {
      if (response.follow) {
        setWall()
      }
    })
    .catch(error => {
      console.log(error)
    })
    e.preventDefault()
  }

  const handleUnfollow = (e: { preventDefault: () => void }) => {
    relationshipApi.destroy(parseInt(id)
    ).then(response => {
      if (response.unfollow) {
        setWall()
      }
    })
    .catch(error => {
      console.log(error)
    })
    e.preventDefault()
  }

  const removeMicropost = (micropostid: number) => {
    let sure = window.confirm("You sure?")
    if (sure === true) {
      micropostApi.remove(micropostid
      ).then(response => {
        if (response.flash) {
          flashMessage(...response.flash)
          setWall()
        }
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

  return (
    <div className="row">
      <aside className="col-md-4">
        <section>
          <h1>
            <Image
              className={"gravatar"}
              src={"https://secure.gravatar.com/Linkvatar/"+user.gravatar_id+"?s="+user.size}
              alt="Example User"
              width={50}
              height={50}
              priority
            />
            {user.name}
          </h1>
        </section>
        <section className="stats">
          <div className="stats">
            <Link href={'/users/'+user.id+'/following'}>
              <strong id="following" className="stat">
                {user.following}
              </strong>
              following
            </Link>
            <Link href={'/users/'+user.id+'/followers'}>
              <strong id="followers" className="stat">
                {user.followers}
              </strong>
              followers
            </Link>
          </div>
        </section>
      </aside>

      <div className="col-md-8">
        {current_user && current_user.value.id !== parseInt(id as string) &&
        <FollowForm
          id={id as string}
          user={user}
          handleUnfollow={handleUnfollow}
          // image={maybe(() => category.backgroundImage)}
          handleFollow={handleFollow}
        />
        // <div id="follow_form">
        //   {
        //     user.current_user_following_user ? (
        //       <form
        //       action={"/relationships/"+id}
        //       acceptCharset="UTF-8"
        //       data-remote="true"
        //       method="post"
        //       onSubmit={handleUnfollow}
        //       >
        //         <input
        //         type="submit"
        //         name="commit"
        //         value="Unfollow"
        //         className="btn"
        //         data-disable-with="Unfollow"
        //         />
        //       </form>
        //     ) : (
        //       <form
        //       action="/relationships"
        //       acceptCharset="UTF-8"
        //       data-remote="true"
        //       method="post"
        //       onSubmit={handleFollow}
        //       >
        //         <div>
        //         <input
        //         type="hidden"
        //         name="followed_id"
        //         id="followed_id"
        //         value={id}
        //         />
        //         </div>
        //         <input
        //         type="submit"
        //         name="commit"
        //         value="Follow"
        //         className="btn btn-primary"
        //         data-disable-with="Follow"
        //         />
        //       </form>
        //     )
        //   }
        // </div>
        }
        {microposts.length > 0 &&
        <>
        <h3>{'Microposts ('+total_count+')'}</h3>
        <ol className="microposts">
          { microposts.map((i, t) => (
              <li key={t} id= {'micropost-'+i.id} >
                <Link href={'/users/'+user.id}>
                  <Image
                    className={"gravatar"}
                    src={"https://secure.gravatar.com/avatar/"+i.gravatar_id+"?s=50"}
                    alt={user.value.name} 
                    width={50}
                    height={50}
                    priority
                  />
                </Link>
                <span className="user"><Link href={'/users/'+i.user_id}>{user.name}</Link></span>
                <span className="content">
                  {i.content}
                  { i.image &&
                    <Image
                      src={''+i.image+''}
                      alt="Example User"
                      width={50}
                      height={50}
                      priority
                    />
                  }
                </span>
                <span className="timestamp">
                {'Posted '+i.timestamp+' ago. '}
                {current_user.value.id === i.user_id &&
                  <Link href={'#/microposts/'+i.id} onClick={() => removeMicropost(i.id)}>delete</Link>
                }
                </span>
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
        }
      </div>
    </div>
  )
}

export default Show
