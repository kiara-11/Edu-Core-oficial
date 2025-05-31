'use client';

import React, { useState } from 'react';
import styles from './Roladmi.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  phone: string;
  registrationDate: string;
}

const Roladmi: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Alejandra Lopez",
      email: "alejandralopez@gmail.com",
      role: "Estudiante",
      status: "Activo",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b5c19ad2?w=150&h=150&fit=crop&crop=face",
      phone: "+569 78394027",
      registrationDate: "12/10/2025"
    },
    {
      id: 2,
      name: "Alejandra Lopez",
      email: "alejandralopez@gmail.com",
      role: "Tutor",
      status: "Activo",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b5c19ad2?w=150&h=150&fit=crop&crop=face",
      phone: "+569 78394027",
      registrationDate: "12/10/2025"
    },
    {
      id: 3,
      name: "Alejandra Lopez",
      email: "alejandralopez@gmail.com",
      role: "Ambos",
      status: "Activo",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b5c19ad2?w=150&h=150&fit=crop&crop=face",
      phone: "+569 78394027",
      registrationDate: "12/10/2025"
    }
  ]);

  const [filterRole, setFilterRole] = useState<string>("Todos");
  const [searchUser, setSearchUser] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRoles, setNewRoles] = useState({
    tutor: false,
    estudiante: false,
    ambos: false
  });

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === "Todos" || user.role === filterRole;
    const matchesSearch = user.name.toLowerCase().includes(searchUser.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchUser.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setNewRoles({
      tutor: user.role === "Tutor" || user.role === "Ambos",
      estudiante: user.role === "Estudiante" || user.role === "Ambos",
      ambos: user.role === "Ambos"
    });
  };

  const handleSave = () => {
    if (selectedUser) {
      let newRole = "";
      if (newRoles.ambos) {
        newRole = "Ambos";
      } else if (newRoles.tutor && newRoles.estudiante) {
        newRole = "Ambos";
      } else if (newRoles.tutor) {
        newRole = "Tutor";
      } else if (newRoles.estudiante) {
        newRole = "Estudiante";
      }

      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: newRole }
          : user
      ));
    }
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setNewRoles({ tutor: false, estudiante: false, ambos: false });
  };

  const handleClose = () => {
    setSelectedUser(null);
    setNewRoles({ tutor: false, estudiante: false, ambos: false });
  };

  const handleRoleChange = (roleType: 'tutor' | 'estudiante' | 'ambos', checked: boolean) => {
    if (roleType === 'ambos') {
      setNewRoles({
        tutor: checked,
        estudiante: checked,
        ambos: checked
      });
    } else {
      const updatedRoles = {
        ...newRoles,
        [roleType]: checked
      };
      
      // Si ambos tutor y estudiante están seleccionados, activar ambos
      if (updatedRoles.tutor && updatedRoles.estudiante) {
        updatedRoles.ambos = true;
      } else {
        updatedRoles.ambos = false;
      }
      
      setNewRoles(updatedRoles);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.card}>
          <h2 className={styles.title}>Gestión de Roles</h2>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label className={styles.label}>Filtro por Rol:</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className={styles.select}
              >
                <option value="Todos">Todos</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Tutor">Tutor</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.label}>Buscar Usuario:</label>
              <input
                type="text"
                placeholder="Buscar"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Foto</div>
              <div className={styles.headerCell}>Nombre</div>
              <div className={styles.headerCell}>Email</div>
              <div className={styles.headerCell}>Rol</div>
              <div className={styles.headerCell}>Estado</div>
              <div className={styles.headerCell}>Acción</div>
            </div>

            {filteredUsers.map((user) => (
              <div key={user.id} className={styles.tableRow}>
                <div className={styles.avatarCell}>
                  <div className={styles.avatar}>
                    <img src={user.avatar} alt={user.name} />
                  </div>
                </div>
                <div className={styles.cell}>{user.name}</div>
                <div className={styles.cellEmail}>{user.email}</div>
                <div className={styles.cell}>{user.role}</div>
                <div className={styles.cell}>
                  <span className={styles.statusActive}>{user.status}</span>
                </div>
                <div className={styles.cell}>
                  <button
                    onClick={() => handleEdit(user)}
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <button 
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <img src={selectedUser.avatar} alt={selectedUser.name} />
              </div>
              <div className={styles.userDetails}>
                <h3 className={styles.userName}>{selectedUser.name}</h3>
                <p className={styles.userEmail}>{selectedUser.email}</p>
                <p className={styles.userPhone}>{selectedUser.phone}</p>
                <p className={styles.userDate}>Registrado: {selectedUser.registrationDate}</p>
              </div>
            </div>

            <div className={styles.roleSection}>
              <h4 className={styles.roleTitle}>Modificar Rol:</h4>
              
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={newRoles.tutor}
                    onChange={(e) => handleRoleChange('tutor', e.target.checked)}
                    className={styles.checkbox}
                  />
                  Tutor
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={newRoles.estudiante}
                    onChange={(e) => handleRoleChange('estudiante', e.target.checked)}
                    className={styles.checkbox}
                  />
                  Estudiante
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={newRoles.ambos}
                    onChange={(e) => handleRoleChange('ambos', e.target.checked)}
                    className={styles.checkbox}
                  />
                  Ambos
                </label>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                CANCELAR
              </button>
              <button
                onClick={handleSave}
                className={styles.saveButton}
              >
                GUARDAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roladmi;