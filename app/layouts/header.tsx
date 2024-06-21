import type { NextPage } from 'next'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { fetchUser, selectUser } from '../../redux/session/sessionSlice'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '../../redux/hooks'
import sessionApi from '../../components/shared/api/sessionApi'
import { useEffect, useState } from 'react'

const Header: NextPage = () => {
  const router = useRouter()
  const userData = useAppSelector(selectUser);
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await dispatch(fetchUser());
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  const onClick = () => {
    sessionApi.destroy(
    ).then(() => {
      dispatch(fetchUser())
      localStorage.removeItem("token")
      localStorage.removeItem("remember_token")
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("remember_token")
      router.push('/')
    })
    .catch((error) => {
      console.log("logout error", error)
    })
  }

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link href="/" id="logo" className="navbar-brand">sample app</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/help" className="nav-link">Help</Link>
            </li>
            {loading ? (
              <li className="nav-item">Loading...</li>
            ) : userData.value.email ? (
              <>
                <li className="nav-item">
                  <Link href="/users" className="nav-link">Users</Link>
                </li>
                <li className="nav-item">
                  <Link href={`/users/${userData.value.id}`} className="nav-link">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link href={`/users/${userData.value.id}/edit`} className="nav-link">Settings</Link>
                </li>
                <li className="nav-item">
                  <hr className="dropdown-divider" />
                </li>
                <li className="nav-item">
                  <Link href="#logout" className="nav-link" onClick={onClick}>Log out</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link href="/login" className="nav-link">Log in</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header
