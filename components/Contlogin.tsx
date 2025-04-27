import Image from "next/image";
import React from "react";
import "./Contlogin.css";
import Link from "next/link";

const Contlogin = () => {
  return (
    <div className="contenedorloginreg">
      <p className="titinisesreg">Iniciar Sesión</p>

      <div className="campollenado">
        <p className="txtcampllen">Email</p>
        <input type="text" className="txtbox" placeholder="Email" />
      </div>
      <div className="campollenado">
        <p className="txtcampllen">Contraseña</p>
        <input type="password" className="txtbox" placeholder="Contraseña" />
      </div>

      <Link href={"/segundainterfaz"} passHref>
        <div className="botoninicioses">
          <p className="txtbotoninise">Iniciar sesion</p>
        </div>
      </Link>

      <p className="olvidastependejo">¿Olvidaste tu contraseña?</p>

      <Link href={"/registro"} passHref>
        <div className="crearcuenta">
          <p className="txtcrear">Crear una cuenta</p>
        </div>
      </Link>

      <div className="redes">
        <Link href={"/google"} passHref>
          <div className="alternativa">
            <Image
              className="google"
              src="/gagel.png"
              width={500}
              height={500}
              alt={"Logo Hotel Pairumani"}
            />
            <p className="continu">Continuar con Google</p>
          </div>
        </Link>

        <Link href={"/faceboodk"} passHref>
          <div className="alternativa">
            <Image
              className="feisbu"
              src="/feisbuk.png"
              width={500}
              height={500}
              alt={"Logo Hotel Pairumani"}
            />
            <p className="continu">Continuar con Facebook</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Contlogin;
