import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import useAuth from '@hooks/useAuth';
import styles from '@styles/Menu.module.css';

export default function Menu( {name} ) {
    const [isOpen, setIsOpen] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>(null)
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

    React.useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false)
        }

        document.addEventListener('mousedown', handleDocumentClick)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    return (
        <div className={styles.menu} ref={menuRef}>
            <button
                type="button"
                className={styles.menuButton}
                onClick={handleClick}
                aria-expanded={isOpen}
                aria-label="Open user menu"
            >
                <Image src={userNameUrl} alt="" width={64} height={64} />
            </button>
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