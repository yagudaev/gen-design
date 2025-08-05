import { SVGProps } from 'react'

interface Props extends SVGProps<SVGSVGElement> {
  size?: number
}

function LucidePlayRounded(props: Props) {
  return (
    <svg
      width={props.size || 84}
      height={props.size || 84}
      viewBox="0 0 84 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.8203 72.1875C20.813 72.1856 19.8236 71.9216 18.9492 71.4213C16.9805 70.3057 15.7566 68.1401 15.7566 65.7891V18.2109C15.7566 15.8533 16.9805 13.6943 18.9492 12.5787C19.8444 12.0642 20.8613 11.7997 21.8936 11.8127C22.926 11.8256 23.9359 12.1157 24.8178 12.6525L65.4807 36.9928C66.3281 37.5242 67.0267 38.2621 67.511 39.1373C67.9952 40.0126 68.2493 40.9964 68.2493 41.9967C68.2493 42.997 67.9952 43.9809 67.511 44.8561C67.0267 45.7313 66.3281 46.4692 65.4807 47.0006L24.8112 71.3475C23.9087 71.8931 22.875 72.1834 21.8203 72.1875Z"
        fill="currentColor"
      />
    </svg>
  )
}

export { LucidePlayRounded }
