'use client';  
import React, { useState } from 'react';  
import './Rol.css';  
import Header from "@/components/Header";  

const Page = () => {  
  const [selectedRole, setSelectedRole] = useState("");  

  const handleRoleSelection = async (role: string) => {  
    setSelectedRole(role);  

    const userId = localStorage.getItem('userId');  

    if (!userId || !role) {  
      alert("Hubo un error al procesar el rol");  
      return;  
    }  

    try {  
      const response = await fetch("/api/assignRole", {  
        method: "POST",  
        headers: {  
          "Content-Type": "application/json",  
        },  
        body: JSON.stringify({ userId, role }),  
      });  

      const data = await response.json();  

      if (response.ok) {  
        // Redirigir según el rol asignado  
        if (role === "1") {  
          window.location.href = "/registro/roles/restudiante";  
        } else if (role === "2") {  
          window.location.href = "/registro/roles/rtutor";  
        }  
      } else {  
        alert(data.message);  
      }  
    } catch (error) {  
      alert("Hubo un error al procesar el rol");  
    }  
  };  

  return (  
    <div>  
      <Header />  

      <div className="registro-content">  
        <div className="registro-options">  
          <button className="option-button" onClick={() => handleRoleSelection("1")}>  
            <img src="/estudiante.png" alt="Estudiante" className="icon" />  
            <span>Estudiante</span>  
          </button>  

          <button className="option-button" onClick={() => handleRoleSelection("2")}>  
            <img src="/tutor1.png" alt="Tutor" className="icon" />  
            <span>Tutor</span>  
          </button>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default Page;
