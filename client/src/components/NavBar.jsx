import { Link, useLocation } from 'react-router-dom'
import styles from './NavBar.module.css'

// define nav item data
const navItems = [
    {
        display: 'Home',
        to: '/'
    },
    {
        display: 'Book',
        to: '/count'
    },
    {
        display: 'About',
        to: '/list'
    },
    {
        display: 'Prices',
        to: '/cards'
    },
    {
        display: 'Contact',
        to: '/api'
    }
]

// based on whether nav item is selected or not, return back its appropriate CSS classes
// selected nav items have an extra class added on
function getNavItemCssClasses(isSelected) {
    if (isSelected) {
        return `${styles['nav-item']} ${styles['nav-item-selected']}`
    }
    return styles['nav-item']
}

export default function NavBar() {
    // gives information about the router (what path it's currently on, etc.)
    const location = useLocation()

    // for each nav item object, create a Link element
    function createNavItemsHtml() {
        return navItems.map(navItem => {

            // determine if nav item is selected by comparing its "to" property against the current location's pathname
            const isSelected = location.pathname === navItem.to

            // get the nav item's appropriate css classes based on its selected status
            const navItemCssClass = getNavItemCssClasses(isSelected)

            // finally, create the Link element
            return (
                <Link className={navItemCssClass} to={navItem.to}>{navItem.display}</Link>
            )
        })
    }

    return (
        <div className={styles.container}>
            { createNavItemsHtml() }
        </div>
    )
}