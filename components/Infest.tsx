'use client';

import React, { useState, useEffect } from 'react';
import styles from './pagosadmin.module.css';

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

interface NewUserData {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  password: string;
  confirmPassword: string;
  fechaNacimiento: string;
  telefono: string;
  genero: string;
  role: string;
}

const Roladmi: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState<string>('Todos');
  const [searchUser, setSearchUser] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [newRoles, setNewRoles] = useState({
    tutor: false,
    estudiante: false
  });

    const [newUserData, setNewUserData] = useState<NewUserData>({
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      password: "",
      confirmPassword: "",
      fechaNacimiento: "",
      telefono: "",
      genero: "1",
      role: "Estudiante"
    });

    const [editUserData, setEditUserData] = useState<Partial<User>>({});

    useEffect(() => {
    fetchUsers();
    }, []);

    const fetchUsers = async () => {
    try {
        setLoading(true);
        const res = await fetch('/api/usuarios');
        if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al obtener usuarios');
        }
        const data: User[] = await res.json();

        // Eliminar duplicados por email y asegurar datos completos
        const uniqueUsers = Array.from(new Map(data.map(u => [u.email, u])).values());
        const usuariosConRoles = uniqueUsers.map(u => ({
        ...u,
        role: u.role || 'Estudiante',
        status: u.status || 'Activo',
        phone: u.phone || 'Sin teléfono',
        name: u.name || 'Sin nombre',
        registrationDate: u.registrationDate || 'No disponible'
        }));

        setUsers(usuariosConRoles);
    } catch (error) {
        console.error('❌ Error al obtener usuarios:', error);
        setMensaje(`Error al cargar usuarios: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        setMostrarModal(true);
    } finally {
        setLoading(false);
    }
    };

      const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'Todos' || user.role === filterRole;
    const matchesSearch =
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.registrationDate.toLowerCase().includes(searchUser.toLowerCase());
    return matchesRole && matchesSearch;
  });

    // Función para manejar cambios en el formulario de nuevo usuario
    const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
    };
  
    // Función para manejar cambios en el formulario de edición
    const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setEditUserData({ ...editUserData, [e.target.name]: e.target.value });
    };
  
    // Función para crear nuevo usuario
    const handleCreateUser = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (newUserData.password !== newUserData.confirmPassword) {
        setMensaje("❗ Las contraseñas no coinciden.");
        setMostrarModal(true);
        return;
      }
  
      // Validaciones adicionales
      if (newUserData.password.length < 6) {
        setMensaje("❗ La contraseña debe tener al menos 6 caracteres.");
        setMostrarModal(true);
        return;
      }
  
      try {
        setLoading(true);
        const res = await fetch("/api/registroa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUserData),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          setRegistroExitoso(true);
          setMostrarModal(true);
          
          setTimeout(() => {
            setShowCreateModal(false);
            setMostrarModal(false);
            setRegistroExitoso(false);
            setNewUserData({
              nombres: "",
              apellidoPaterno: "",
              apellidoMaterno: "",
              email: "",
              password: "",
              confirmPassword: "",
              fechaNacimiento: "",
              telefono: "",
              genero: "1",
              role: "Estudiante"
            });
            fetchUsers(); // Refrescar la lista
          }, 2000);
        } else {
          setMensaje(data.message || "Ha ocurrido un error al crear el usuario.");
          setMostrarModal(true);
        }
      } catch (error) {
        console.error("❌ Error al crear usuario:", error);
        setMensaje("Error de conexión al crear usuario. Intenta nuevamente.");
        setMostrarModal(true);
      } finally {
        setLoading(false);
      }
    };
  
    const handleEdit = (user: User) => {
      setSelectedUser(user);
      setEditUserData({ ...user }); // Crear una copia completa
      setNewRoles({
        tutor: user.role === 'Tutor',
        estudiante: user.role === 'Estudiante'
      });
    };
  
  const handleSave = async () => {
    if (!selectedUser || !editUserData) return;
  
    // Validar rol seleccionado
    let newRole = '';
    if (newRoles.tutor) newRole = 'Tutor';
    else {
      setMensaje('❗ Debes seleccionar al menos un rol.');
      setMostrarModal(true);
      return;
    }
  
    // Validar email si se cambió
    if (editUserData.email && editUserData.email !== selectedUser.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editUserData.email)) {
        setMensaje('❗ El formato del email no es válido.');
        setMostrarModal(true);
        return;
      }
    }
  
    try {
      setSaveLoading(true);
      let roleUpdated = false;
      let dataUpdated = false;
  
      // Actualizar rol si cambió
      if (newRole !== selectedUser.role) {
        const roleRes = await fetch('/api/asignar-rol', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: selectedUser.email, role: newRole }),
        });
  
        if (!roleRes.ok) {
          const errorData = await roleRes.json();
          throw new Error(errorData.message || 'Error al asignar rol');
        }
        roleUpdated = true;
      }
  
      // Actualizar otros datos si cambiaron
      const dataChanged = 
        editUserData.name !== selectedUser.name || 
        editUserData.phone !== selectedUser.phone || 
        editUserData.email !== selectedUser.email;
  
      if (dataChanged) {
        const updateRes = await fetch('/api/actualizar-usuario', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedUser.id,
            name: editUserData.name,
            phone: editUserData.phone,
            email: editUserData.email,
            originalEmail: selectedUser.email // ✅ Agregar email original como identificador
          }),
        });
  
        if (!updateRes.ok) {
          const errorData = await updateRes.json();
          throw new Error(errorData.message || 'Error al actualizar datos del usuario');
        }
        dataUpdated = true;
      }
  
      // Actualizar estado local
      const updatedUsers = users.map(u =>
        u.id === selectedUser.id ? { 
          ...u, 
          ...editUserData,
          role: newRole
        } : u
      );
  
      setUsers(updatedUsers);
      setSelectedUser(null);
      setEditUserData({});
      setNewRoles({ tutor: false, estudiante: false });
  
      // Mostrar mensaje de éxito
      const updateMessage = [];
      if (roleUpdated) updateMessage.push('rol');
      if (dataUpdated) updateMessage.push('datos personales');
      
      setMensaje(`✅ Usuario actualizado correctamente: ${updateMessage.join(' y ')}`);
      setRegistroExitoso(true);
      setMostrarModal(true);
  
    } catch (error) {
      console.error('❌ Error al guardar cambios:', error);
      setMensaje(`Error al guardar cambios: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setMostrarModal(true);
    } finally {
      setSaveLoading(false);
    }
  };
  
    const handleCancel = () => {
      setSelectedUser(null);
      setEditUserData({});
      setNewRoles({ tutor: false, estudiante: false });
    };
  
    const cerrarModal = () => {
      setMostrarModal(false);
      setRegistroExitoso(false);
      setMensaje("");
    };
  
    return (
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.card}>
            <div className={styles.headerSection}>
              <h2 className={styles.title}>Informes y Reportes</h2>
    
            </div>
  
            <div className={styles.filters}>
              <label>
                Filtro por Rol:
                <select
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                  className={styles.select}
                  disabled={loading}
                >
                  <option value="Todos">Todos</option>
                  <option value="Estudiante">Estudiante</option>
                  <option value="Tutor">Tutor</option>
                </select>
              </label>
  
              <label>
                Buscar Usuario:
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o fecha..."
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                />
              </label>
            </div>
  
            {loading && (
              <div className={styles.loadingMessage}>
                Cargando usuarios...
              </div>
            )}
  
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <div>Foto</div>
                <div>Nombre</div>
                <div>Fecha de Registro</div>
                <div>Rol</div>
                <div>Estado</div>
                <div>Acciones</div>
                <div>Editar</div>
              </div>
  
              {filteredUsers.length === 0 && !loading ? (
                <div className={styles.noResults}>
                  No se encontraron usuarios con los filtros aplicados.
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className={styles.tableRow}>
                    <div className={styles.avatarCell}>
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        onError={(e) => {
                          e.currentTarget.src = 'https://ui-avatars.com/api/?name=Usuario&background=0D8ABC&color=fff&size=40';
                        }}
                      />
                    </div>
                    <div>{user.name}</div>
                    <div>{user.registrationDate}</div>
                    <div>
                      <span className={`${styles.roleBadge} ${styles[user.role?.toLowerCase() || 'estudiante']}`}>
                        {user.role}
                      </span>
                    </div>
                    <div>
                      <span className={styles.statusActive}>{user.status}</span>
                    </div>
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.editButton} 
                        onClick={() => handleEdit(user)}
                        disabled={loading}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
  
 
  
        {/* Modal de mensajes */}
        {mostrarModal && (
          <div className={styles.modalOverlay}>
            {registroExitoso ? (
              <div className={styles.successModal}>
                <h3>✅ ¡Operación Exitosa!</h3>
                <p>{mensaje || 'La operación se completó correctamente.'}</p>
                <button className={styles.successButton} onClick={cerrarModal}>
                  Continuar
                </button>
              </div>
            ) : (
              <div className={styles.errorModal}>
                <h3>⚠️ Atención</h3>
                <p>{mensaje}</p>
                <button className={styles.errorButton} onClick={cerrarModal}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        )}
  
        {/* Sidebar para editar usuario */}
        {selectedUser && (
          <div className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <button 
                className={styles.closeButton} 
                onClick={handleCancel}
                disabled={saveLoading}
              >
                ×
              </button>
              
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <img 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://ui-avatars.com/api/?name=Usuario&background=0D8ABC&color=fff&size=80';
                    }}
                  />
                </div>
                <div className={styles.userDetails}>
                  <label>
                    Nombre:
                    <input
                      type="text"
                      name="name"
                      value={editUserData.name || ''}
                      onChange={handleEditUserChange}
                      className={styles.editInput}
                      placeholder="Nombre completo"
                      disabled={saveLoading}
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      type="email"
                      name="email"
                      value={editUserData.email || ''}
                      onChange={handleEditUserChange}
                      className={styles.editInput}
                      placeholder="correo@ejemplo.com"
                      disabled={saveLoading}
                    />
                  </label>
                  <label>
                    Teléfono:
                    <input
                      type="tel"
                      name="phone"
                      value={editUserData.phone || ''}
                      onChange={handleEditUserChange}
                      className={styles.editInput}
                      placeholder="+591 70000000"
                      disabled={saveLoading}
                    />
                  </label>
                  <p>Registrado: {selectedUser.registrationDate}</p>
                </div>
              </div>
  
              <div className={styles.roleSection}>
                <h4>Modificar Rol:</h4>
                <label className={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name="rol"
                    checked={newRoles.tutor}
                    onChange={() => setNewRoles({ tutor: true, estudiante: false })}
                    disabled={saveLoading}
                  />
                  Tutor
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name="rol"
                    checked={newRoles.estudiante}
                    onChange={() => setNewRoles({ tutor: false, estudiante: true })}
                    disabled={saveLoading}
                  />
                  Estudiante
                </label>
              </div>
  
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.cancelButton} 
                  onClick={handleCancel}
                  disabled={saveLoading}
                >
                  Cancelar
                </button>
                <button 
                  className={styles.saveButton} 
                  onClick={handleSave}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Roladmi;

  