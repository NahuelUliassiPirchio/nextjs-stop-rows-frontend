import Head from 'next/head'
import Router from 'next/router'
import CustomersMain from '../components/CustomersMain'
import useAuth from '../hooks/useAuth'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { user, loading } = useAuth()
  console.log(user);
  

  if (loading) return <div>Loading...</div>

  if (!user || user.role === "customer") return (
    <CustomersMain />
  ) 
  else if (user.role === "owner") {
    const shopId = user.shops[0].id
    Router.push("/shops/" + shopId)
  }
}
