'use client';

import Link from "next/link";
import React, { useState, useEffect } from "react";
import "./Contexp.css";

const Contexp = () => {
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      if (experience && description.trim()) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    };

    validateForm();
  }, [experience, description]);

  return (
    <div className="experiencia">
      <p className="titpantaexp">Cuéntanos sobre tu experiencia</p>
      <div className="aniosexpe">
        <p className="txtexperien">Años de experiencia</p>
        <select
          className="aniosexpdeta"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <Link href={isFormValid ? "/registro/roles/restudiante/rfinal" : "#"} passHref>
        <div className={`butonexper ${isFormValid ? "" : "disabled"}`}>
          <p className="txbutexper">Continuar</p>
        </div>
      </Link>
    </div>
  );
};

export default Contexp;
