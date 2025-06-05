'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./Contregistro.css";

const Contregistro = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    password: "",
    confirmPassword: "",
    fechaNacimiento: "",
    telefono: "",
    genero: "1",
  });

  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMensaje("❗ Las contraseñas no coinciden.");
      setMostrarModal(true);
      return;
    }

    try {
      const res = await fetch("/api/registroa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Mostrar mensaje de éxito
        setRegistroExitoso(true);
        setMostrarModal(true);
        
        // ✅ Redirigir después de 3 segundos
        setTimeout(() => {
          const nombreCompleto = `${formData.apellidoPaterno} ${formData.apellidoMaterno} ${formData.nombres}`;
          localStorage.setItem("nombreCompleto", nombreCompleto);
          localStorage.setItem("email", formData.email);
          router.push("/Inicio");
        }, 3000);
      } else {
        setMensaje(data.message || "Ha ocurrido un error.");
        setMostrarModal(true);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setMensaje("Error de red al registrar.");
      setMostrarModal(true);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setRegistroExitoso(false);
  };

  return (
    <div className="contenedorloginreg">
      <div className="contenedor-formulario">
        <h2 className="titulo-principal">Bienvenido a SIREAP</h2>
        <p className="subtitulo">Crea tu cuenta y accede a clases particulares personalizadas</p>

        <form className="formulario-registro" onSubmit={handleSubmit}>
          <label>
            Nombres <span className="campo-obligatorio">*</span>
            <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
          </label>

          <label>
            Apellido Paterno <span className="campo-obligatorio">*</span>
            <input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} required />
          </label>

          <label>
            Apellido Materno <span className="campo-obligatorio">*</span>
            <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} required />
          </label>

          <label>
            Correo Electrónico <span className="campo-obligatorio">*</span>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>

          <label>
            Contraseña <span className="campo-obligatorio">*</span>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>

          <label>
            Confirmar Contraseña <span className="campo-obligatorio">*</span>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </label>

          <label className="fecha-label">
            Fecha de Nacimiento <span className="campo-obligatorio">*</span>
            <div className="fecha-container">
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
                className="input-fecha"
              />
              <span className="icono-calendario">📅</span>
            </div>
          </label>

          <label>
            Teléfono <span className="campo-obligatorio">*</span>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+591"
              required
            />
          </label>

          <label>
            Género <span className="campo-obligatorio">*</span>
            <select name="genero" value={formData.genero} onChange={handleChange} required>
              <option value="1">Femenino</option>
              <option value="2">Masculino</option>
            </select>
          </label>

          <p className="txtterminos">
            Al crear o utilizar una cuenta, usted acepta nuestros{" "}
            <a href="#" className="link-terminos">Términos de servicio</a> y{" "}
            <a href="#" className="link-terminos">Política de privacidad</a>.
          </p>

          <button className="boton-continuar" type="submit">Continuar</button>
        </form>

        {mostrarModal && (
          <div className="modal-overlay">
            {registroExitoso ? (
              <div className="modal-exito">
                <h3>✅ ¡Registro Exitoso!</h3>
                <p className="bienvenida">¡Bienvenido a EDUCORE!</p>
                <p>Tu cuenta ha sido creada exitosamente. Serás redirigido automáticamente en unos segundos.</p>
                <button className="modal-exito-btn" onClick={cerrarModal}>Continuar</button>
              </div>
            ) : (
              <div className="modal">
                <h3>⚠️ Atención</h3>
                <p>{mensaje}</p>
                <button className="modal-btn" onClick={cerrarModal}>Cerrar</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contregistro;