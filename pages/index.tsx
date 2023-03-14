import CustomersMain from '@components/CustomersMain'
import useAuth from '@hooks/useAuth'
import OwnersMain from '@components/OwnersMain'

export default function Home() {
  const { user, loading } = useAuth()
  console.log(user);

  if (loading) return <div>Loading...</div>

  if (!user || user.role === "customer") 
    return <CustomersMain />
  else if (user.role === "owner")
    return <OwnersMain />
}
