import React from 'react'
import Footer from 'components/Footer/footer.js'

function Layout({ children }) {
    return (
        <div>
            {children}
            <Footer />
        </div>
    )
}

export default Layout
