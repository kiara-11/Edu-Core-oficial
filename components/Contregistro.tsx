// components/Contregistro.tsx
import React from "react";
import "./Contregistro.css";
import Link from "next/link";

const Contregistro = () => {
  return (
    <div className="contenedorloginreg">
      <h2 className="titulo-principal">Bienvenido a SIREAP</h2>
      <p className="subtitulo">Crea tu cuenta y accede a clases particulares personalizadas</p>

      <form className="formulario-registro">
        <label>
          Nombres:
          <input type="text" placeholder="Nombres" name="nombres" required />
        </label>

        <label>
          Apellidos:
          <input type="text" placeholder="Apellidos" name="apellidos" required />
        </label>

        <label>
          Correo Electrónico:
          <input type="email" placeholder="example@gmail.com" name="email" required />
        </label>

        <label>
          Contraseña:
          <input type="password" placeholder="Contraseña" name="password" required />
        </label>

        <label>
          Confirmar Contraseña:
          <input type="password" placeholder="Confirmar Contraseña" name="confirmPassword" required />
        </label>

        <label className="fecha-label">
          Fecha de Nacimiento:
          <div className="fecha-container">
            <input
              type="date"
              placeholder="DD/MM/AA"
              name="fechaNacimiento"
              required
              className="input-fecha"
            />
            <span className="icono-calendario">📅</span>
          </div>
        </label>

        <label>
          Teléfono:
          <input
            type="tel"
            placeholder="+591"
            name="telefono"
            pattern="^\+591\d{7,9}$"
            title="Número con prefijo +591 y 7 a 9 dígitos"
            required
          />
        </label>

        <p className="txtterminos">
          Al crear o utilizar una cuenta, usted acepta nuestros{" "}
          <a href="#" className="link-terminos">Términos de servicio</a> y{" "}
          <a href="#" className="link-terminos">Política de privacidad</a>.
        </p>

        <Link href="/rfinal">
          <button className="boton-continuar" type="button">Continuar</button>
        </Link>
      </form>

      <p className="txt-tienes-cuenta">
        ¿Ya tienes una cuenta? <Link href="/login" className="link-iniciar-sesion">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Contregistro;
