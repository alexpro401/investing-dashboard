import * as React from "react"

function SwapDirectionIcon(props) {
  return (
    <svg width={26} height={26} fill="none" {...props}>
      <rect x={0.5} y={0.5} width={25} height={25} rx={12.5} fill="#141926" />
      <path
        d="M16.46 14.46a.65.65 0 10-.92-.92l.92.92zM13 17l-.46.46a.65.65 0 00.92 0L13 17zm-2.54-3.46a.65.65 0 10-.92.92l.92-.92zm5.08 0l-3 3 .92.92 3-3-.92-.92zm-2.08 3l-3-3-.92.92 3 3 .92-.92z"
        fill="#788AB4"
      />
      <path
        d="M13.65 8a.65.65 0 10-1.3 0h1.3zm-1.3 9a.65.65 0 101.3 0h-1.3zm0-9v9h1.3V8h-1.3z"
        fill="#788AB4"
      />
      <rect
        x={0.5}
        y={0.5}
        width={25}
        height={25}
        rx={12.5}
        stroke="url(#prefix__paint0_radial_5339_168054)"
        strokeOpacity={0.5}
      />
      <rect
        x={0.5}
        y={0.5}
        width={25}
        height={25}
        rx={12.5}
        stroke="url(#prefix__paint1_radial_5339_168054)"
      />
      <rect
        x={0.5}
        y={0.5}
        width={25}
        height={25}
        rx={12.5}
        stroke="url(#prefix__paint2_radial_5339_168054)"
      />
      <defs>
        <radialGradient
          id="prefix__paint0_radial_5339_168054"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-16.58804 -18.05136 14.00351 -12.86832 13 13)"
        >
          <stop stopColor="#050505" />
          <stop offset={1} stopColor="#525252" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id="prefix__paint1_radial_5339_168054"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(15.6 13.40856 -9.63152 11.20567 13 13)"
        >
          <stop stopColor="#6D99DB" />
          <stop offset={1} stopColor="#6D99DB" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id="prefix__paint2_radial_5339_168054"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-14.24813 13.77994 -10.29255 -10.64225 13 13)"
        >
          <stop stopColor="#587EB7" />
          <stop offset={1} stopColor="#587EB7" stopOpacity={0} />
        </radialGradient>
      </defs>
    </svg>
  )
}

const MemoSwapDirectionIcon = React.memo(SwapDirectionIcon)
export default MemoSwapDirectionIcon
