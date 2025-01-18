"use client"
import FloatingCan from '@/components/FloatingCan'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useGSAP } from '@gsap/react'
import { Content } from '@prismicio/client'
import { Cloud, Clouds, Environment,  Text } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'
import * as THREE from "three"


gsap.registerPlugin(useGSAP, ScrollTrigger)

type SkyDiveProps = {
    sentence: string | null
    flavor: Content.SkyDiveSliceDefaultPrimary["flavor"]
}

export default function Scene({sentence, flavor}: SkyDiveProps) {
    const groupRef = useRef<THREE.Group>(null)
    const canRef = useRef<THREE.Group>(null)
    const cloud1Ref = useRef<THREE.Group>(null)
    const cloud2Ref = useRef<THREE.Group>(null)
    const cloudsRef = useRef<THREE.Group>(null)
    const wordsRef = useRef<THREE.Group>(null)

    const ANGLE = 75 * (Math.PI / 180)


    const getXPosition = (distance: number)=> distance * Math.cos(ANGLE) 
    const getYPosition = (distance: number)=> distance * Math.sin(ANGLE) 


    const getXYPosition = (distance: number)=>({

        x: getXPosition(distance),
        y: getYPosition(-1 * distance)
    })


    useGSAP(()=>{

        if (
            !cloudsRef.current ||
            !cloud1Ref.current ||
            !cloud2Ref.current ||
            !canRef.current ||
            !wordsRef.current 
        ) return;


        // Set initial positions
        gsap.set(cloudsRef.current.position,{z:10})

        gsap.set(canRef.current.position,{
            ...getXYPosition(-4)
        })
        gsap.set(wordsRef.current.children.map((word)=>word.position),
        {
            ...getXYPosition(7),
            z: 2
        })


        // Spinning can
        gsap.to(canRef.current.rotation,{
            y: Math.PI*2,
            duration:1.7,
            repeat:-1,
            ease:"none"
        })



        // Infinite cloud Mouvement
        const DISTANCE = 15
        const DURATION = 6

        gsap.set([cloud2Ref.current.position, cloud1Ref.current.position],{
            ...getXYPosition(DISTANCE)
        })


        gsap.to(cloud1Ref.current.position,{
            y: `+=${getYPosition(DISTANCE * 2)}`,
            x: `+=${getXPosition(DISTANCE * -2)}`,
            ease:"none",
            repeat: -1,
            duration:DURATION
        })

        
        gsap.to(cloud2Ref.current.position,{
            y: `+=${getYPosition(DISTANCE * 2)}`,
            x: `+=${getXPosition(DISTANCE * -2)}`,
            ease:"none",
            repeat: -1,
            delay: DURATION / 2,
            duration:DURATION
        })



        const scrollTl = gsap.timeline({
            scrollTrigger:{
                trigger:".skydive",
                pin:true,
                start:"top top",
                end: "+=2000",
                scrub:1.5
            }
        })


        scrollTl
        .to("body",{
            backgroundColor:"#c0f0f5",
            overwrite:"auto",
            duration:.1,
        })
        .to(cloudsRef.current.position,{z:0, duration:.3},0)
        .to(canRef.current.position,{x:0, y:0, duration:.3, ease:"back.out(1.7)"})
        .to(wordsRef.current.children.map((word)=>word.position),{
            keyframes:[
                {x:0,y:0,z:-1},
                {...getXYPosition(-7), z:7}
            ],
            stagger:.3,
            },
            0
         )
         .to(canRef.current.position,{
            ...getXYPosition(4),
            duration:.5,
            ease:"back.in(1.7)"
         })
         .to(cloudsRef.current.position,{
            z: 7, 
            duration:.5
         })
    })




  return (
    <group ref={groupRef}>
        {/* Can */}
        <group rotation={[0,0,0.5]}> 
            <FloatingCan 
                ref={canRef} 
                flavor={flavor}
                rotationIntensity={0}
                floatIntensity={3}
                floatspeed={3}
            >

                <pointLight intensity={30} color={"#8c0413"} decay={.6}/>
            </FloatingCan>
        </group>

        {/* Clouds */}
        <Clouds ref={cloudsRef}>
            <Cloud ref={cloud1Ref} bounds={[10,10,2]}/>
            <Cloud ref={cloud2Ref} bounds={[10,10,2]}/>
        </Clouds>

        {/* Text */}
        <group ref={wordsRef}>
            {sentence && <ThreeText sentence={sentence} color='#F97315'/>}
        </group>

       

        {/* Lights */}
        <ambientLight intensity={2} color={"#9DDEFA"}/>
        <Environment files={"/hdr/field.hdr"} environmentIntensity={1.5}/>
    </group>
  )
}

function ThreeText({sentence, color="white"}:{
    sentence: string,
    color?: string
}){

    const words = sentence.toUpperCase().split(" ")

    const material = new THREE.MeshLambertMaterial()
    const isDesktop = useMediaQuery("(min-width: 950px)", true)

    return words.map((word:string, wordIndex:number)=>(
        <Text key={`${wordIndex}-${word}`} 
            color={color}
            scale={isDesktop ? 1: 5}
            material= {material}
            font="/fonts/Alpino-Variable.woff"
            fontWeight = {900}
            anchorX={"center"}
            anchhorY={"middle"}
            characters="ABCDEFGHIJKLMNOPQRSTUVXYZ!,.?'"
        >
            {word}
        </Text>
    ))

   
}