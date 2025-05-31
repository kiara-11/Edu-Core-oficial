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
        headers: { "Content-Type": "application/json" },
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
    <div className="contenedor-principal">
      {/* Lado izquierdo: formulario */}
      <div className="lado-izquierdo">
        <h1 className="titulo-principal">Bienvenido a SIREAP<br />Iniciar Sesión</h1>

        <form className="formulario-login" onSubmit={handleSubmit}>
          <div className="campollenado">
            <label htmlFor="email" className="txtcampllen">Email</label>
            <input
              type="email"
              id="email"
              className="txtbox"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="campollenado">
            <label htmlFor="password" className="txtcampllen">Contraseña</label>
            <input
              type="password"
              id="password"
              className="txtbox"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-texto">{error}</p>}

          <button type="submit" className="botoninicioses">
            <span className="txtbotoninise">Iniciar sesión</span>
          </button>

          <p className="olvidastependejo">¿Olvidaste tu contraseña?</p>

          <Link href="/registro" className="crearcuenta">
            <span className="txtcrear">Crear una cuenta</span>
          </Link>
        </form>
      </div>

      {/* Lado derecho: imagen y texto */}
      <div className="lado-derecho">
        <Image
          className="Buh"
          src="/bu.png"
          width={500}
          height={500}
          alt=""
          priority
                  />
      
      </div>
    </div>
  );
};

export default Contlogin;
