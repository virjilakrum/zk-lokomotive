import React from 'react'
import Link from 'next/link'
import styles from './linkCard.module.scss'

function LinkCard(props) {
    return (
        <div className={styles.linkCard}>
            <i className={props.faStyles} />
            <h1>{props.title}</h1>
            <p>{props.body}</p>
            <Link href={props.link}>
                <a className='button'>{props.linkText}</a>
            </Link>
        </div>
    )
}

export default LinkCard
