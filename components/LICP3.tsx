import React from 'react'
import "./LICP.css";
import Link from "next/link";

const LICP3 = () => {
    return (
        <div className='contLICP3'>
            <div className='propg'>
                <p className='titprop'>EduCore</p>
                <p className='mintit'>Simplifica tu educación</p>
                <p className='mintit'>Encuentra los cursos que necesitas.</p>
                <p className='mintit'>Reserva tus clases de acuerdo a tu tiempo disponible.</p>
                <p className='mintit'>Aprende de manara personalizada.</p>
            </div>
            <div className='propg'>
                <p className='mintit'>Contacto directo con tutores</p>
                <p className='mintit'>Pagos seguros</p>
                <p className='mintiti'>Explora los cursos que tenemos para ofrecerte, registrate y se parte de nuestra comunidad.</p>
                <div className='CbtnExp'>

                    <Link href="/explorarcurso" className="btExCu">
                        <p className='txbtncu'>Explorar cursos</p>
                    </Link>
                    <Link href="/novedades" className="btExCu">
                        <p className='txbtncu'>Novedades</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LICP3