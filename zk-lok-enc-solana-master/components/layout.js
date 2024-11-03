import React from 'react'
import Footer from 'components/Footer/footer.js'

function Layout({ children }) {
    return (
        <div className='rootDiv'>
            {children}
        </div>
    )
}

export default Layout
