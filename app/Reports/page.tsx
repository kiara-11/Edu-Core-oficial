// app/reports/page.tsx
"use client";

import React, { useState } from "react";
import HeaderSaend from "@/components/HeaderySidebarAdmin"; // Ajusta la ruta si tu alias es diferente
import ReportPreview from "../../components/ReportPreview";
import styles from "../../components/ReportsPage.module.css";

export default function ReportsPage() {
  const [tipoReporte, setTipoReporte] = useState("");
  const [formatoSalida, setFormatoSalida] =
    useState<"PDF" | "Excel" | "CSV" | null>(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const handleFormatoClick = (formato: "PDF" | "Excel" | "CSV") => {
    setFormatoSalida(formato);
  };

  const handleGenerate = () => {
    alert(
      `Generando reporte:\nTipo: ${tipoReporte}\nFechas: ${fechaInicio} a ${fechaFin}\nCategoría: ${categoria}\nFormato: ${formatoSalida}`
    );
    // Aquí podrías invocar tu API para generar el reporte real
  };

  return (
    <>
      <HeaderSaend children={undefined} />

      <div className={styles.container}>
        <h1 className={styles.title}>Generación de Informes</h1>
        <p className={styles.subtitle}>
          Genera y administra tus reportes académicos
        </p>

        {/* 1) Tipo de Reporte */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>Tipo de Reporte</div>
          <div className={styles.fieldGroup}>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              className={styles.select}
            >
              <option value="" disabled>
                Selecciona un tipo de reporte
              </option>
              <option value="Reporte de Asistencia">
                Reporte de Asistencia
              </option>
              <option value="Reporte de Calificaciones">
                Reporte de Calificaciones
              </option>
              <option value="Reporte de Actividades">
                Reporte de Actividades
              </option>
            </select>
          </div>
        </section>

        {/* 2) Formato de Salida */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>Formato de Salida</div>
          <div className={styles.formatButtons}>
            <div
              className={`${styles.formatButton} ${
                formatoSalida === "PDF" ? styles.selectedFormat : ""
              }`}
              onClick={() => handleFormatoClick("PDF")}
            >
              <img src="/reports/pdf.png" alt="PDF" />
              <span>PDF</span>
            </div>
            <div
              className={`${styles.formatButton} ${
                formatoSalida === "Excel" ? styles.selectedFormat : ""
              }`}
              onClick={() => handleFormatoClick("Excel")}
            >
              <img src="/reports/excel.png" alt="Excel" />
              <span>Excel</span>
            </div>
            <div
              className={`${styles.formatButton} ${
                formatoSalida === "CSV" ? styles.selectedFormat : ""
              }`}
              onClick={() => handleFormatoClick("CSV")}
            >
              <img src="/reports/csv.png" alt="CSV" />
              <span>CSV</span>
            </div>
          </div>
        </section>

        {/* 3) Parámetros del Reporte */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>Parámetros del Reporte</div>
          <div className={styles.dateGroup}>
            <div className={styles.fieldGroup}>
              <label>Fecha Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Fecha Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className={styles.select}
              >
                <option value="Todas">Todas las categorías</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Ciencias">Ciencias</option>
                <option value="Humanidades">Humanidades</option>
                <option value="Idiomas">Idiomas</option>
              </select>
            </div>
          </div>
        </section>

        {/* 4) Vista Previa */}
        <ReportPreview
          tipoReporte={tipoReporte}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          categoria={categoria}
          formato={formatoSalida}
          onGenerate={handleGenerate}
        />
      </div>
    </>
  );
}
