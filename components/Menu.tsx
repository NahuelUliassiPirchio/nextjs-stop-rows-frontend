import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import useAuth from '@hooks/useAuth';
import styles from '@styles/Menu.module.css';

export default function Menu( {name} ) {
    const [isOpen, setIsOpen] = React.useState(false)
    const { logout } = useAuth()

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    const handleLogout = () => {
        logout()
        window.location.href = '/'
    }

    const userName = name.split(' ').join('+')
    const userNameUrl = `https://ui-avatars.com/api/?name=${userName}&background=0D8ABC&color=fff&size=64`
    return (
        <div className={styles.menu}>
            <Image src={userNameUrl} onClick={handleClick} alt="user" width={64} height={64} />
            {
                isOpen && (
                    <div className={styles.menuDropdown}>
                        <ul>
                            <li>
                                <Link href="/profile">Profile</Link>
                            </li>
                            <li>
                                <Link href='/' onClick={handleLogout}>Logout</Link>
                            </li>
                        </ul>
                    </div>
                )
            }
        </div>
    );
}