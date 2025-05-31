// app/Certificado/page.tsx
import React from "react";
import Certificado from "@/components/Certificado";
import HeaderySidebar from "../../components/HeaderySidebarTutor"; 
// (o usa alias "@/components/HeaderySidebarTutor" si tienes configurado paths)

export default function Page() {
  return (
    <HeaderySidebar>
      <Certificado />
    </HeaderySidebar>
  );
}
