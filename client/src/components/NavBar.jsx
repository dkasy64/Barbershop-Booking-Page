import styles from './NavBar.module.css'

const navItems = [
  { display: 'Home', to: '#home' },
  { display: 'Booking', to: '#booking' },
  { display: 'About', to: '#about' },
  { display: 'Prices', to: '#prices' },
  { display: 'Contact', to: '#contact' },
]

export default function NavBar() {
  return (
    <div className={styles.container}>
      {navItems.map((navItem) => (
        <a key={navItem.to} className={styles['nav-item']} href={navItem.to}>
          {navItem.display}
        </a>
      ))}
    </div>
  )
}
