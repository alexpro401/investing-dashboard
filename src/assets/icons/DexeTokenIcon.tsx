import { FC } from "react"

const DexeTokenIcon: FC = ({ ...rest }) => {
  return (
    <svg
      {...rest}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#1D2129" />
      <path
        d="M5.5858 11.1861C5.12773 14.7301 7.63508 17.9607 11.1791 18.4188C11.7577 18.4911 12.3364 18.4911 12.8909 18.3947L17.2787 22.7585C11.3238 25.6757 4.13926 23.2406 1.22205 17.2857C-0.128065 14.5131 -0.369157 11.3307 0.546991 8.41351L5.5858 11.1861Z"
        fill="url(#paint0_radial_2_8050)"
      />
      <path
        d="M5.87506 11.3549L0.571045 8.41354C0.836246 7.61794 1.17377 6.87055 1.55952 6.12317C3.12662 3.32651 5.75451 1.25312 8.8646 0.433407C15.2294 -1.32656 21.8112 2.43447 23.5712 8.79928C24.415 11.8611 24.0051 15.14 22.4139 17.9125C22.0282 18.5876 21.5701 19.2386 21.0638 19.8413L5.87506 11.3549ZM7.75557 7.11164L18.3636 13.1389C18.9904 9.619 16.676 6.26782 13.156 5.61688C11.2273 5.27935 9.25034 5.83386 7.75557 7.11164Z"
        fill="#3AFFD6"
      />
      <defs>
        <radialGradient
          id="paint0_radial_2_8050"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(7.07788 17.6174) rotate(29.4366) scale(10.761 4.74806)"
        >
          <stop stopColor="#979797" />
          <stop offset="1" stopColor="#777777" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export default DexeTokenIcon
