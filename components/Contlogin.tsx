'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./Contlogin.css";

const Contlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [adminMessage, setAdminMessage] = useState(false); // ✅ mensaje visual para admin

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, ingresa tu email y contraseña.");
      return;
    }

    // ✅ Si es admin (no está en la BD)
    if (email === "a@dmin" && password === "admin") {
      setAdminMessage(true);
      setTimeout(() => {
        window.location.href = "/adminrol";
      }, 2500);
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
        localStorage.setItem("email", email);
        localStorage.setItem("nombreCompleto", data.nombreCompleto);
        localStorage.setItem("user_name", data.user_name);
        window.location.href = "/Inicio";
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error de red al iniciar sesión");
    }
  };

  const handleRecovery = async () => {
    if (!recoveryEmail) {
      setRecoveryMessage("Ingresa un correo para recuperar tu contraseña.");
      return;
    }
    try {
      const response = await fetch("/api/recuperar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail }),
      });
      const data = await response.json();
      setRecoveryMessage(data.message);
    } catch (error) {
      setRecoveryMessage("Error al enviar solicitud de recuperación.");
    }
  };

  return (
    <div className="contenedor-principal">
      <div className="lado-izquierdo">
        <h1 className="titulo-principal">
          Bienvenido a SIREAP<br />Iniciar Sesión
        </h1>

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

          <p className="olvidastependejo" onClick={() => setShowModal(true)}>¿Olvidaste tu contraseña?</p>

          <Link href="/registro" className="crearcuenta">
            <span className="txtcrear">Crear una cuenta</span>
          </Link>
        </form>
      </div>

      <div className="lado-derecho">
        <Image
          className="Buh"
          src="/bu.png"
          width={500}
          height={500}
          alt="búho"
          priority
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>🔒 Recuperar contraseña</h3>
            <p>Ingresa tu correo y recibirás instrucciones para cambiar tu contraseña.</p>
            <input
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              className="txtbox"
              placeholder="Correo electrónico"
            />
            <button className="modal-btn" onClick={handleRecovery}>Enviar</button>
            <button className="modal-btn" onClick={() => setShowModal(false)}>Cerrar</button>
            {recoveryMessage && <p className="mensaje-texto">{recoveryMessage}</p>}
          </div>
        </div>
      )}

      {/* ✅ Modal bonito para admin */}
      {adminMessage && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <span className="emoji">✅</span>
            <p className="mensaje-admin">Ingresando a Administración del Curso...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contlogin;