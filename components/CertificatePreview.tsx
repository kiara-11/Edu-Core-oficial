import React from "react";
import styles from "./CertificatePreview.module.css";

interface Props {
  model: string;
  studentName: string;
  courseName: string;
  courseDesc: string;
  teacherName: string;
  signature: string | null;
}

export default function CertificatePreview({
  model,
  studentName,
  courseName,
  courseDesc,
  teacherName,
  signature,
}: Props) {
  return (
    <div className={styles.previewContainer}>
      <img src={`/${model}.png`} alt={`Modelo ${model}`} className={styles.background} />

      {/* Texto superpuesto */}
      <div className={styles.overlay}>
        <h2 className={styles.studentName}>{studentName}</h2>
        <p className={styles.courseName}>{courseName}</p>
        <p className={styles.courseDesc}>{courseDesc}</p>
        <p className={styles.teacherName}>Docente: {teacherName}</p>

        {signature && (
          <img src={signature} alt="Firma del docente" className={styles.signature} />
        )}
      </div>
    </div>
  );
}
