import * as React from "react"
const MessageCustomIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.width}
        height={props.height}
        fill="none"
        transform="scale(-1 1)"
        viewBox="0 0 24 24"
        {...props}
    >
        <g stroke="#fff" strokeWidth={1.5}>
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.6.376 3.112 1.043 4.453.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.591l2.226-.595a1.634 1.634 0 0 1 1.149.133A9.958 9.958 0 0 0 12 22Z" />
            <path strokeLinecap="round" d="M8 10.5h8M8 14h5.5" opacity={0.5} />
        </g>
    </svg>
)
export default MessageCustomIcon;
