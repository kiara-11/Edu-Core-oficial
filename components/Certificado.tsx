"use client"; // ← Esto obliga a que este archivo se trate como un Client Component

// components/Certificado.tsx
import React, { useState } from "react";
import CertificatePreview from "./CertificatePreview";
import styles from "./Certificate.module.css"; // (verás más abajo dónde viviría este CSS)

export default function Certificado() {
  const [selectedModel, setSelectedModel] = useState<string>("modelo1");
  const [studentName, setStudentName] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [courseDesc, setCourseDesc] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const [signature, setSignature] = useState<string | null>(null);

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSignature(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 👉 PON AQUÍ las funciones:
  const handleGuardar = () => {
    console.log("Certificado guardado con los siguientes datos:");
    console.log({
      modelo: selectedModel,
      estudiante: studentName,
      curso: courseName,
      descripcion: courseDesc,
      docente: teacherName,
      firma: signature ? "[firma subida]" : "[sin firma]",
    });

    alert("Certificado guardado (simulado)");
  };

  const handleCancelar = () => {
    setSelectedModel("modelo1");
    setStudentName("");
    setCourseName("");
    setCourseDesc("");
    setTeacherName("");
    setSignature(null);
  };

  return (
    <div className={styles.container}>
      <h1>Generador de certificados</h1>
      <p>Seleccione un modelo de certificado:</p>

      {/* 1) Selector de modelo */}
      <div className={styles.models}>
        {["modelo1", "modelo2", "modelo3"].map((model) => (
          <div
            key={model}
            className={`${styles.modelCard} ${
              selectedModel === model ? styles.selected : ""
            }`}
            onClick={() => setSelectedModel(model)}
          >
            <img src={`/${model}.png`} alt={model} />

            <p>{model}</p>
          </div>
        ))}
      </div>

      {/* 2) Formulario de datos */}
      <div className={styles.form}>
        <label>Nombre del estudiante</label>
        <input
          type="text"
          placeholder="Nombre del estudiante"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <label>Nombre del curso</label>
        <input
          type="text"
          placeholder="Nombre del curso"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <label>Descripción del curso</label>
        <textarea
          placeholder="Descripción del curso"
          value={courseDesc}
          onChange={(e) => setCourseDesc(e.target.value)}
        />
        <label>Docente</label>
        <input
          type="text"
          placeholder="Nombre del docente"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
        />

        <div className={styles.firmaBlock}>
          <label>Firma del docente:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleSignatureUpload}
          />
        </div>
      </div>

      {/* 3) Título “Vista Previa” */}
      <h2 className={styles.previewTitle}>Vista Previa</h2>

      {/* 4) Componente de vista previa */}
      <CertificatePreview
        model={selectedModel}
        studentName={studentName}
        courseName={courseName}
        courseDesc={courseDesc}
        teacherName={teacherName}
        signature={signature}
      />
        <div className={styles.buttonContainer}>
        <button onClick={handleGuardar} className={styles.guardarBtn}>
            Guardar certificado
        </button>
        <button onClick={handleCancelar} className={styles.cancelarBtn}>
            Cancelar
        </button>
        </div>
    </div>
  );
}
