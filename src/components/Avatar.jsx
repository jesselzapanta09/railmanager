import React from "react"
import { imageUrl } from "../services/api"

/**
 * Avatar — shows image if available, otherwise username initial
 * Props: user, size (px), fontSize
 */
export default function Avatar({ user, size = 40, fontSize = "1rem", style = {} }) {
    const src = imageUrl(user?.avatar)
    console.log(user)
    if (src) {
        return (
            <img
                src={src}
                alt={user?.username}
                style={{
                    width: size, height: size,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: "2px solid rgba(255,255,255,0.2)",
                    ...style,
                }}
            />
        )
    }

    return (
        <div style={{
            width: size, height: size,
            borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg,#0054a0,#0c87e8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white",
            fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize,
            ...style,
        }}>
            {user?.username?.[0]?.toUpperCase()}
        </div>
    )
}