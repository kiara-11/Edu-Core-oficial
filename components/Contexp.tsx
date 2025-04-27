import Link from "next/link";
import React from "react";
import "./Contexp.css";

const Contexp = () => {
  return (
    <div className="experiencia">
      <p className="titpantaexp">Cuéntanos sobre tu experiencia</p>
      <div className="aniosexpe">
        <p className="txtexperien">Años de experiencia</p>
        <select className="aniosexpdeta">
          <option value="">Tiempo de experiencia</option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="mas">Más</option>
        </select>
      </div>

      <div className="descexp">
        <p className="txtexperien">
          Describe tu experiencia (Si no tuviste experiencia formal, cuéntanos
          si ayudaste a alguien a aprender de manera informal)
        </p>

        <div className="contexper">
          <textarea
            className="subcontexper"
            placeholder="Escribe tu experiencia aquí"
          />
        </div>
      </div>

      <Link href={"/"} passHref>
        <div className="butonexper">
          <p className="txbutexper">Continuar</p>
        </div>
      </Link>
    </div>
  );
};

export default Contexp;
