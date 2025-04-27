import React from 'react'
import Image from 'next/image';
import './Rol.css';
import Link from 'next/link';
import Header from "@/components/Header";
const Page = () => {
  return (

    <div className="">
     <Header />
     <div className="background-logo">
        <img src="/logoBackground.png" alt="Logo de fondo" className="logo-image" />
      </div>

      <div className="registro-content">
        <div className="registro-options">
        <Link href="/registro/roles/restudiante" passHref>
  <button className="option-button">
    <img src="/estudiante.png" alt="Estudiante" className="icon" />
    <span>Estudiante</span>
  </button>
</Link>

<Link href="/registro/roles/rtutor" passHref>
  <button className="option-button">
    <img src="/tutor1.png" alt="Tutor" className="icon" />
    <span>Tutor</span>
  </button>
</Link>
        </div>
      </div>
    </div>
  )
}

export default Page;