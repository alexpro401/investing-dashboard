import * as React from "react"

function SwapDirectionButton(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={26} height={26} fill="none" {...props}>
      <rect x={0.5} y={0.5} width={25} height={25} rx={12.5} fill="#141926" />
      <g clipPath="url(#prefix__clip0_5179_161550)">
        <path
          d="M11.223 7.527h-.001l.11 2.998c.012.293-.278.537-.646.546h-.02c-.36 0-.655-.228-.666-.515l-.059-1.612c-1.615.886-2.609 2.353-2.609 3.925 0 1.813 1.266 3.446 3.3 4.264.33.131.462.45.296.712-.118.185-.352.292-.596.292a.802.802 0 01-.3-.058C7.546 17.081 6 15.084 6 12.87c0-1.901 1.188-3.677 3.124-4.763l-2.318.054h-.02c-.36 0-.655-.228-.666-.515-.01-.293.28-.537.647-.545l3.698-.086.03-.007A.179.179 0 0110.538 7c.368-.008.675.222.686.515v.012zM16.876 17.561l2.317-.054c.364-.015.677.222.687.515.01.293-.279.537-.646.545l-3.698.086-.03.007a.18.18 0 01-.042.007h-.02c-.36 0-.655-.228-.666-.515v-.012l-.111-2.998c-.01-.292.28-.537.647-.545.365-.015.675.222.686.514l.059 1.613c1.614-.886 2.608-2.353 2.608-3.925 0-1.813-1.265-3.447-3.3-4.264-.33-.132-.462-.451-.296-.713.166-.261.567-.366.896-.235 2.487 1 4.033 2.996 4.033 5.211 0 1.902-1.188 3.677-3.124 4.763z"
          fill="#788AB4"
        />
        <path
          d="M11.223 7.527h-.001l.11 2.998c.012.293-.278.537-.646.546h-.02c-.36 0-.655-.228-.666-.515l-.059-1.612c-1.615.886-2.609 2.353-2.609 3.925 0 1.813 1.266 3.446 3.3 4.264.33.131.462.45.296.712-.118.185-.352.292-.596.292a.802.802 0 01-.3-.058C7.546 17.081 6 15.084 6 12.87c0-1.901 1.188-3.677 3.124-4.763l-2.318.054h-.02c-.36 0-.655-.228-.666-.515-.01-.293.28-.537.647-.545l3.698-.086.03-.007A.179.179 0 0110.538 7c.368-.008.675.222.686.515v.012zM16.876 17.561l2.317-.054c.364-.015.677.222.687.515.01.293-.279.537-.646.545l-3.698.086-.03.007a.18.18 0 01-.042.007h-.02c-.36 0-.655-.228-.666-.515v-.012l-.111-2.998c-.01-.292.28-.537.647-.545.365-.015.675.222.686.514l.059 1.613c1.614-.886 2.608-2.353 2.608-3.925 0-1.813-1.265-3.447-3.3-4.264-.33-.132-.462-.451-.296-.713.166-.261.567-.366.896-.235 2.487 1 4.033 2.996 4.033 5.211 0 1.902-1.188 3.677-3.124 4.763z"
          stroke="#788AB4"
          strokeWidth={0.2}
        />
      </g>
      <rect
        x={0.5}
        y={0.5}
        width={25}
        height={25}
        rx={12.5}
        stroke="url(#prefix__paint0_radial_5179_161550)"
        strokeOpacity={0.5}
      />
      <rect
        x={0.5}
        y={0.5}
        width={25}
        height={25}
        rx={12.5}
        stroke="url(#prefix__paint1_radial_5179_161550)"
      />
      <rect
        x={0.5}
        y={0.5}
        width={25}
        height={25}
        rx={12.5}
        stroke="url(#prefix__paint2_radial_5179_161550)"
      />
      <defs>
        <radialGradient
          id="prefix__paint0_radial_5179_161550"
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
          id="prefix__paint1_radial_5179_161550"
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
          id="prefix__paint2_radial_5179_161550"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-14.24813 13.77994 -10.29255 -10.64225 13 13)"
        >
          <stop stopColor="#587EB7" />
          <stop offset={1} stopColor="#587EB7" stopOpacity={0} />
        </radialGradient>
        <clipPath id="prefix__clip0_5179_161550">
          <path fill="#fff" transform="translate(1 1)" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const MemoSwapDirectionButton = React.memo(SwapDirectionButton)
export default MemoSwapDirectionButton
