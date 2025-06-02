'use client';

import React, { useState, useEffect } from 'react';
import styles from './Roladmi.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  status?: string;
  avatar: string;
  phone: string;
  registrationDate: string;
}

const Roladmi: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState<string>('Todos');
  const [searchUser, setSearchUser] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRoles, setNewRoles] = useState({
    tutor: false,
    estudiante: false,
    ambos: false
  });

  // Cargar usuarios desde API y roles desde localStorage
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/usuarios');
        if (!res.ok) throw new Error('Error al obtener usuarios');
        const data: User[] = await res.json();

        const storedRoles = localStorage.getItem('rolesUsuarios');
        const roles: Record<string, string> = storedRoles ? JSON.parse(storedRoles) : {};

        const usuariosConRoles = data.map(u => ({
          ...u,
          role: roles[u.email] || 'Estudiante',
          status: roles[u.email] ? 'Activo' : 'Pendiente'
        }));

        setUsers(usuariosConRoles);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();
  }, []);

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'Todos' || user.role === filterRole;
    const matchesSearch =
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setNewRoles({
      tutor: user.role === 'Tutor' || user.role === 'Ambos',
      estudiante: user.role === 'Estudiante' || user.role === 'Ambos',
      ambos: user.role === 'Ambos'
    });
  };

  const saveRolesToStorage = (roles: Record<string, string>) => {
    localStorage.setItem('rolesUsuarios', JSON.stringify(roles));
  };

  const handleSave = () => {
    if (!selectedUser) return;

    let newRole = '';
    if (newRoles.ambos) newRole = 'Ambos';
    else if (newRoles.tutor && newRoles.estudiante) newRole = 'Ambos';
    else if (newRoles.tutor) newRole = 'Tutor';
    else if (newRoles.estudiante) newRole = 'Estudiante';

    const storedRoles = localStorage.getItem('rolesUsuarios');
    const roles: Record<string, string> = storedRoles ? JSON.parse(storedRoles) : {};

    roles[selectedUser.email] = newRole;
    saveRolesToStorage(roles);

    const updatedUsers = users.map(u =>
      u.email === selectedUser.email ? { ...u, role: newRole, status: 'Activo' } : u
    );

    setUsers(updatedUsers);
    setSelectedUser(null);
  };

  const handleCancel = () => {
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
      updatedRoles.ambos = updatedRoles.tutor && updatedRoles.estudiante;
      setNewRoles(updatedRoles);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.card}>
          <h2 className={styles.title}>Gestión de Roles</h2>

          <div className={styles.filters}>
            <label>
              Filtro por Rol:
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className={styles.select}
              >
                <option value="Todos">Todos</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Tutor">Tutor</option>
                <option value="Ambos">Ambos</option>
              </select>
            </label>

            <label>
              Buscar Usuario:
              <input
                type="text"
                placeholder="Buscar"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div>Foto</div>
              <div>Nombre</div>
              <div>Email</div>
              <div>Rol</div>
              <div>Estado</div>
              <div>Acción</div>
            </div>

            {filteredUsers.map(user => (
              <div key={user.email} className={styles.tableRow}>
                <div className={styles.avatarCell}>
                  <img src={user.avatar} alt={user.name} />
                </div>
                <div>{user.name}</div>
                <div>{user.email}</div>
                <div>{user.role}</div>
                <div>
                  <span className={styles.statusActive}>{user.status}</span>
                </div>
                <div>
                  <button className={styles.editButton} onClick={() => handleEdit(user)}>
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
            <button className={styles.closeButton} onClick={handleCancel} aria-label="Cerrar">×</button>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <img src={selectedUser.avatar} alt={selectedUser.name} />
              </div>
              <div className={styles.userDetails}>
                <h3>{selectedUser.name}</h3>
                <p>{selectedUser.email}</p>
                <p>{selectedUser.phone}</p>
                <p>Registrado: {selectedUser.registrationDate}</p>
              </div>
            </div>

            <div className={styles.roleSection}>
              <h4>Modificar Rol:</h4>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={newRoles.tutor}
                  onChange={e => handleRoleChange('tutor', e.target.checked)}
                />
                Tutor
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={newRoles.estudiante}
                  onChange={e => handleRoleChange('estudiante', e.target.checked)}
                />
                Estudiante
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={newRoles.ambos}
                  onChange={e => handleRoleChange('ambos', e.target.checked)}
                />
                Ambos
              </label>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.cancelButton} onClick={handleCancel}>Cancelar</button>
              <button className={styles.saveButton} onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roladmi;