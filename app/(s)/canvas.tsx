'use client'
import { Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'

export default function ThreeCanvas() {
  const ref = useRef()
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Canvas className='min-h-screen' gl={{ antialias: false }} dpr={[2,2]} >
     <Text color="black" fontSize={0.5} position={[0, 0, 0]}>Hello world</Text>
    </Canvas>
  )
}