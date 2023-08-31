import CustomersMain from '@components/CustomersMain'
import useAuth from '@hooks/useAuth'
import OwnersMain from '@components/OwnersMain'
import Loading from '@components/Loading'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return <Loading/>

  if (!user || user.role === "customer") 
    return <CustomersMain />
  else if (user.role === "owner")
    return <OwnersMain />
}
