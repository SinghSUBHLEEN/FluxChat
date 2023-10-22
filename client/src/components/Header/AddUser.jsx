import * as React from "react"
const AddUser = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.height}
        height={props.width}
        fill="#fff"
        stroke="#fff"
        className="icon line-color"
        data-name="Line Color"
        viewBox="-0.96 -0.96 25.92 25.92"
        {...props}
    >
        <path
            d="M3 17h4m-2 2v-4"
            style={{
                fill: "none",
                stroke: "#e53e3e",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
            }}
        />
        <path
            d="M9 20.64c.31.07.65.12 1 .17a22 22 0 0 0 3 .19c6 0 8-2 8-2v-1a5 5 0 0 0-5-5h-6a4.71 4.71 0 0 0-1 .1"
            style={{
                fill: "none",
                stroke: "#ededed",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
            }}
        />
        <circle
            cx={13}
            cy={8}
            r={5}
            data-name="primary"
            style={{
                fill: "none",
                stroke: "#ededed",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
            }}
        />
    </svg>
)
export default AddUser;
