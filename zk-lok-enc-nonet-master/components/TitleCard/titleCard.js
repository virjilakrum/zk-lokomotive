import React from 'react'
import styles from './titleCard.module.scss'

function TitleCard(props) {
    return (
        <div className={styles.titleCard}>
            <h1>{props.title}</h1>
            <p>{props.text}</p>
        </div>
    )
}

export default TitleCard
