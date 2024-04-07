import React from 'react'
import styles from './titleCard.module.scss'

function TitleCard(props) {
    return (
        <div className={styles.titleCard}>
            <h1>{props.title}</h1>
            <p>{props.text}</p>
            <p>(Page layout may be subject to change)</p>
        </div>
    )
}

export default TitleCard
