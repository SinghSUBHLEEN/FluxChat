import * as React from "react"
const NotFoundComponent = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={props.height}
        height={props.width}
        fill="#fff"
        stroke={props.color}
        strokeWidth={0.001}
        viewBox="-2.4 -2.4 64.8 64.8"
        {...props}
    >
        <path d="M9 39h6v8a1 1 0 0 0 2 0v-8h3a1 1 0 0 0 0-2h-3v-2a1 1 0 0 0-2 0v2h-5V27a1 1 0 0 0-2 0v11a1 1 0 0 0 1 1zM40 39h6v8a1 1 0 0 0 2 0v-8h3a1 1 0 0 0 0-2h-3v-2a1 1 0 0 0-2 0v2h-5V27a1 1 0 0 0-2 0v11a1 1 0 0 0 1 1zM29.5 48c3.584 0 6.5-2.916 6.5-6.5v-9c0-3.584-2.916-6.5-6.5-6.5S23 28.916 23 32.5v9c0 3.584 2.916 6.5 6.5 6.5zM25 32.5c0-2.481 2.019-4.5 4.5-4.5s4.5 2.019 4.5 4.5v9c0 2.481-2.019 4.5-4.5 4.5S25 43.981 25 41.5v-9z" />
        <path d="M0 0v60h60V0H0zm2 2h56v10H2V2zm56 56H2V14h56v44z" />
        <path d="M54.293 3.293 52 5.586l-2.293-2.293-1.414 1.414L50.586 7l-2.293 2.293 1.414 1.414L52 8.414l2.293 2.293 1.414-1.414L53.414 7l2.293-2.293zM3 11h39V3H3v8zm2-6h35v4H5V5z" />
    </svg>
)
export default NotFoundComponent;
