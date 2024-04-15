import {ReactNode} from "react";

export default function RandomSize ({children}: {children: ReactNode}) {
  const randomSize = Math.abs(Math.random());

  const random3dTranslation = new Array(3).fill(0).map(() => Math.floor(Math.random() * 10) + 1);
  
  return <div style={{
    transform: `translate3d(${random3dTranslation.join(",")}px)`,
  
  }} className={`relative flex transform-gpu scale-[${randomSize}]`}>{children}
    <span className='text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>{randomSize}</span>
  </div>;
}
