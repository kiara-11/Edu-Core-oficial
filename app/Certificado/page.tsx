// app/Certificado/page.tsx
import React from "react";
import Certificado from "@/components/Certificado";
import HeaderySidebarAdmin from "../../components/HeaderySidebarAdmin"; 
// (o usa alias "@/components/HeaderySidebarTutor" si tienes configurado paths)

export default function Page() {
  return (
    <HeaderySidebarAdmin>
      <Certificado />
    </HeaderySidebarAdmin>
  );
}
