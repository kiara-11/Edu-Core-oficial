import React from "react";
import TarjTutComt from "./TarjTutComt";
import TarjResena from "./TarjResena";
import "./ContComent.css";

const ContComent = () => {
  return (
    <div className="ComentariosyValoraciones">
      <div className="TarjTuTComen">
        <TarjTutComt />
        <div className="InfoClassComen">
          <p className="InfTxTaboutComt">Sobre la clase</p>
          <p className="DescTxtComt">
            I have been a guitar teacher for over 15 years, teaching all skill
            levels and ages. I have taught private and group lessons in
            different music establishments as well as in home lessons, and I'm
            happy to provide a resume for any inquiries. I enjoy playing and
            teaching pop, rock, classical guitar, folk finger-style, Brazilian
            jazz, soul, R&B, funk and improvisational guitar. I am able to
            assist with tablature, reading notes and reading sheet music in many
            different styles including the ones listed above. Through plucking
            and picking exercises, rhythmic strumming and sight reading, I
            assure that I can help my students reach a higher level of playing.
            I have been performing guitar and bass guitar for over 10 years
            around Chicago and the West Coast. Performing is my passion and I
            believe it's the most important aspect of learning music whether you
            are playing guitar for fun, in front of friends, or
            performing guitar at a concert.
          </p>
        </div>
      </div>

      <div className="contenedorReseñas">
        <p className="txtResenas">Reseñas</p>
        <div className="tarjetasResenas">
          <TarjResena />
          <TarjResena />
          <TarjResena />
        </div>
      </div>
    </div>
  );
};

export default ContComent;
