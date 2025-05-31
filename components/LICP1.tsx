import React from 'react'
import Image from "next/image";
import "./LICP.css";

const LICP1 = () => {
    return (
        <div className="lcont1">
            <div className="lconttext">
                <p className="ltxtgenini">
                    <span className="ltitverdecini">
                        Accede con tu cuenta y aprovecha todos los beneficios como
                    </span>
                    <span className="ltitnarncini"> Estudiante</span>
                </p>
                <div className="lcontima">
                    <Image
                        className="limag"
                        src="/Group 237640.png"
                        width={500}
                        height={500}
                        alt={"Logo Hotel Pairumani"}
                    />
                    <p className="ldesc">
                        Acceso centralizado a todos tus cursos y tutorías
                    </p>
                </div>
                <div className="lcontima">
                    <Image
                        className="limag"
                        src="/Group 237641.png"
                        width={500}
                        height={500}
                        alt={"Logo Hotel Pairumani"}
                    />
                    <p className="ldesc">
                        Habla directamente con los instructores antes y después de reservar.
                    </p>
                </div>
                <div className="lcontima">
                    <Image
                        className="limag"
                        src="/Group 237642.png"
                        width={500}
                        height={500}
                        alt={"Logo Hotel Pairumani"}
                    />
                    <p className="ldesc">
                        Notificaciones de clases programadas y recordatorios
                    </p>
                </div>
            </div>

            <div className="lcontimagen">
                <div className="lcontimag2">
                    <Image
                        className="limag1"
                        src="/Group (1).png"
                        width={500}
                        height={500}
                        alt={"Logo Hotel Pairumani"}
                    />
                    <Image
                        className="limag1"
                        src="/Group.png"
                        width={500}
                        height={500}
                        alt={"Logo Hotel Pairumani"}
                    />
                </div>
            </div>
        </div>
    )
}

export default LICP1