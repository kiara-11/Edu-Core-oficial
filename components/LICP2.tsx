import React from 'react'
import Image from "next/image";
import "./LICP.css";

const LICP2 = () => {
    return (
        <div className="lcont2">
            <div className="lcontimap2">
                <Image
                    className="limagp2"
                    src="/pana 1.png"
                    width={500}
                    height={500}
                    alt={"Logo Hotel Pairumani"}
                />
            </div>

            <div className="lconttext">
                <p className="ltitp2">
                    <span className="ltitnarncini">Súmate como</span>
                    <span className="ltitverdecini"> Tutor </span>
                    <span className="ltitnarncini">y haz crecer tu impacto educativo</span>
                </p>
                <div className="lcontima">
                    <Image
                        className="limag"
                        src="/Group 237641 (1).png"
                        width={500}
                        height={500}
                        alt={"Logo Hotel Pairumani"}
                    />
                    <p className="ldesc">
                        Muestra tu perfil y tus clases a cientos de estudiantes interesados.
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
                    <p className="ldesc">Tú decides cuándo y cómo dar tus clases.</p>
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
                        Olvídate de Facebook y panfletos, tus cursos se promocionan solos.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LICP2