// components/ReportPreview.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./ReportPreview.module.css";

interface PreviewProps {
  tipoReporte: string;
  fechaInicio: string;
  fechaFin: string;
  categoria: string;
  formato: "PDF" | "Excel" | "CSV" | null;
  onGenerate: () => void;
}

const dummyData = [
  { fecha: "2023-01-01", progreso: 75 },
  { fecha: "2023-02-01", progreso: 80 },
  { fecha: "2023-03-01", progreso: 82 },
  { fecha: "2023-04-01", progreso: 78 },
  { fecha: "2023-05-01", progreso: 85 },
  { fecha: "2023-06-01", progreso: 90 },
];

export default function ReportPreview({
  tipoReporte,
  fechaInicio,
  fechaFin,
  categoria,
  formato,
  onGenerate,
}: PreviewProps) {
  return (
    <div className={styles.wrapper}>
      {/* Botón de generar reporte */}
      <div className={styles.generateContainer}>
        <button className={styles.generateBtn} onClick={onGenerate}>
          Generar Reporte
        </button>
      </div>

      {/* Contenedor de la vista previa */}
      <div className={styles.previewContainer}>
        <h2 className={styles.previewTitle}>Vista Previa del Reporte</h2>
        <p className={styles.summary}>
          <strong>Tipo:</strong> {tipoReporte || "—"} |{" "}
          <strong>Fechas:</strong> {fechaInicio || "—"} – {fechaFin || "—"} |{" "}
          <strong>Categoría:</strong> {categoria} | <strong>Formato:</strong>{" "}
          {formato || "—"}
        </p>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dummyData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="progreso"
                name="Progreso Académico"
                stroke="#0B7077"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
