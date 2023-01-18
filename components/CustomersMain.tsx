import Map from './Map'
import styles from '../styles/CustomersMain.module.css'

function CustomersMain() {
  return (
    <div className={styles.container}>
      <aside className={styles.aside}>
        <h1>Shops</h1>
      </aside>
      <main>
        <Map />
      </main>
    </div>
  )
}

export default CustomersMain