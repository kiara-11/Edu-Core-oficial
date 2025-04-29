'use client';  

import React, { useState } from "react";
import Image from "next/image";
import "./Contlogin.css";
import Link from "next/link";

const Contlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!email || !password) {
      setError("Por favor, ingresa tu email y contraseña.");
      return;
    }

    try {

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ email, password }),  
      });

      const data = await response.json(); 


      if (response.ok) {

        localStorage.setItem("token", data.token);

        window.location.href = "/"; 
      } else {
        setError(data.message); 
      }
    } catch (error) {
 
      setError("Hubo un error al iniciar sesión");
    }
  };

  return (
    <div className="contenedorloginreg">
      <p className="titinisesreg">Iniciar Sesión</p>

      {/* Formulario de login */}
      <form onSubmit={handleSubmit}>
        <div className="campollenado">
          <p className="txtcampllen">Email</p>
          <input
            type="text"
            className="txtbox"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Actualizar el estado con el email ingresado
          />
        </div>

        <div className="campollenado">
          <p className="txtcampllen">Contraseña</p>
          <input
            type="password"
            className="txtbox"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Actualizar el estado con la contraseña ingresada
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="botoninicioses">
          <p className="txtbotoninise">Iniciar sesión </p>
        </button>
      </form>

      <p className="olvidastependejo">¿Olvidaste tu contraseña?</p>

      <Link href={"/registro"} passHref>
        <div className="crearcuenta">
          <p className="txtcrear">Crear una cuenta</p>
        </div>
      </Link>

      {/* Sección de botones para iniciar sesión con Google o Facebook */}
      <div className="redes">
        <Link href="/google" className="alternativa">
          <Image
            className="google"
            src="/gagel.png"
            width={500}
            height={500}
            alt={"Logo Google"}
          />
          <p className="continu">Continuar con Google</p>
        </Link>

        <Link href="/facebook" className="alternativa">
          <Image
            className="feisbu"
            src="/feisbuk.png"
            width={500}
            height={500}
            alt={"Logo Facebook"}
          />
          <p className="continu">Continuar con Facebook</p>
        </Link>
      </div>
    </div>
  );
};

export default Contlogin;
