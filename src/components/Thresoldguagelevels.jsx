import React from 'react'
import "../../src/Pages/meter.css"

export default function Thresoldguagelevels() {
    return (
        <div className="threshold-labels">
            <div className="threshold"
                style={{
                    position: "absolute",
                    left: `14%`,
                    bottom: `24%`,
                    transform: "translate(-50%, -50%)",
                }}
            >
                -100
            </div>
            <div className="threshold"
                style={{
                    position: "absolute",
                    left: `17%`,
                    bottom: `48%`,
                    transform: "translate(-50%, -50%)",
                }}
            >
                -75
            </div>
            <div className="threshold"
                style={{
                    position: "absolute",
                    left: `24%`,
                    bottom: `68%`,
                    transform: "translate(-50%, -50%)",
                }}
            >
                -50
            </div>
            <div className="threshold"
                style={{
                    position: "absolute",
                    left: `36%`,
                    top: `12%`,
                    transform: "translate(-50%, -50%)",
                }}
            >
                -25
            </div>
            <div className="threshold"
                style={{
                    position: "absolute",
                    left: `50%`,
                    top: `8%`,
                    transform: "translate(-50%, -50%)",
                }}
            >
                0
            </div>
            <div className="threshold"
                style={{
                    position: "absolute",
                    right: `34%`,
                    top: `12%`,
                    transform: "translate(-50%, -50%)",
                }}
            >
                25
            </div>

            <div className="threshold"
                style={{
                    position: "absolute",
                    right: `22%`,
                    bottom: `68%`,
                    transform: "translate(-50%, -50%)",
                }}
            >
                50
            </div>

            <div className="threshold"
                style={{
                    position: "absolute",
                    right: `15%`,
                    bottom: `48%`,
                    transform: "translate(-50%, -50%)",
                }}
            >
                75
            </div>

            <div className="threshold"
                style={{
                    position: "absolute",
                    right: `11%`,
                    bottom: `24%`,
                    transform: "translate(-50%, -50%)",
                }}
            >
                100
            </div>

        </div>
    )
}
