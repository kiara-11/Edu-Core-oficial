import React from "react";
import Image from "next/image";
import "./TarjEstadoCurso.css";
import "./CardNoti.css";
import Link from "next/link";

interface Curso {
  Id_progcur: number;
  NombreTutor: string;
  NombreCurso: string;
  Horario: string;
  Modalidad: string;
  Id_estado: number;
}

const TarjEstadoCurso = ({ curso }: { curso: Curso }) => {
  return (
    <div>
      <Link href={`/ComentariosVal?id=${curso.Id_progcur}`} className="contenidotarjetaestado">
        <Image
          className="ImaTutEstado"
          src="/zrimage.png"
          width={500}
          height={500}
          alt="Foto del tutor"
        />
        <div className="DetalleClase">
          <p className="NomTutEstado">{curso.NombreTutor}</p>
          <p className="ClasTutEstado">{curso.NombreCurso}</p>
          <p className="datenoti">{curso.Horario}</p>
          <p className="datenoti">{curso.Modalidad}</p>
        </div>
      </Link>
    </div>
  );
};

export default TarjEstadoCurso;
