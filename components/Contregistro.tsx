'use client';  
import React, { useState } from 'react'; 
import './Contlogin.css'; 
import Link from 'next/link'; 
import Header from "@/components/Header"; 

const Contregistro = () => {
  const [name, setName] = useState(''); // Estado para el nombre completo
  const [email, setEmail] = useState(''); // Estado para el email
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [confirmPassword, setConfirmPassword] = useState(''); // Estado para la confirmación de la contraseña
  const [error, setError] = useState(''); // Estado para mostrar los errores de validación

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, llena todos los campos.');
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Limpiar el error si todo es válido
    setError('');

    // Enviar el formulario para crear la cuenta
    const response = await fetch("/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Guardar el userId en el localStorage después de un registro exitoso
      localStorage.setItem('userId', data.userId);

      // Redirigir al paso de selección de rol
      window.location.href = "/registro/roles";
    } else {
      alert(data.message);  // Mostrar el error del backend
    }
  };

  return (
    <div className="contenedorloginreg">

      <p className="titinisesreg">Crear una cuenta</p>

      <form onSubmit={handleSubmit}>
        <div className="campollenado">
          <p className="txtcampllen">Nombre completo</p>
          <input
            type="text"
            className="txtbox"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)} // Actualizar el estado con el nombre
          />
        </div>

        <div className="campollenado">
          <p className="txtcampllen">Email</p>
          <input
            type="email"
            className="txtbox"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Actualizar el estado con el email
          />
        </div>

        <div className="campollenado">
          <p className="txtcampllen">Contraseña</p>
          <input
            type="password"
            className="txtbox"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Actualizar el estado con la contraseña
          />
        </div>

        <div className="campollenado">
          <p className="txtcampllen">Confirmar contraseña</p>
          <input
            type="password"
            className="txtbox"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Actualizar el estado con la confirmación
          />
        </div>

        {/* Mostrar el error si existe */}
        {error && <p className="error-message">{error}</p>}

        <p className="txtterminos">
          Al crear o utilizar una cuenta, usted acepta nuestros Términos de servicio y Política de privacidad.
        </p>

        <button type="submit" className="botncontinu">
          Crear cuenta
        </button>
      </form>
    </div>
  );
};

export default Contregistro;
