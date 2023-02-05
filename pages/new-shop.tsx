import ShopForm from "@components/ShopForm"
import useAuthGuard from "@hooks/useAuthGuard"

export default function NewShop() {
    useAuthGuard('/login', 'owner')
    
    return (
        <div>
            <ShopForm />
        </div>
    )
}