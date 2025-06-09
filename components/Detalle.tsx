'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Detalle.module.css';
import Link from 'next/link';


interface Lesson {
  id: number;
  title: string;
  description: string;
}

interface Review {
  id: number;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date?: string;
}

interface Tutor {
  name: string;
  image: string;
  description: string;
  email?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  lessons: number;
  schedule: string;
  price: number;
  startDate: string;
  modality: string;
  level: string;
  duration: string;
  learningTopics?: string[];
  lessonsList?: Lesson[];
  tutor: Tutor;
  reviews?: Review[];
  subject?: string;
  levelDescription?: string;
  minStudents?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface CourseDetailProps {
  courseId?: string;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId }) => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCourseId = courseId || searchParams.get('id');

  useEffect(() => {
    checkUserAuth();

    if (currentCourseId) {
      fetchCourseData(currentCourseId);
    } else {
      setError('ID del curso no proporcionado');
      setLoading(false);
    }
  }, [currentCourseId]);

  const checkUserAuth = () => {
    try {
      if (typeof window !== 'undefined') {
        const nombreCompleto = localStorage.getItem('nombreCompleto');
        const email = localStorage.getItem('email');

        if (nombreCompleto && email) {
          setUser({
            id: email,
            name: nombreCompleto,
            email: email
          });
          setIsLoggedIn(true);
        } else {
          const usuarioString = localStorage.getItem('usuario');
          if (usuarioString) {
            const usuarioData = JSON.parse(usuarioString);
            if (usuarioData.nombre && usuarioData.correo) {
              setUser({
                id: usuarioData.correo,
                name: usuarioData.nombre,
                email: usuarioData.correo
              });
              setIsLoggedIn(true);
            } else {
              setIsLoggedIn(false);
              setUser(null);
            }
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const fetchCourseData = async (id: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/detalle/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Curso no encontrado');
        } else if (response.status >= 500) {
          throw new Error('Error del servidor. Intente más tarde.');
        } else {
          throw new Error('Error al cargar el curso');
        }
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al cargar el curso');
      }

      if (!data.course) {
        throw new Error('Datos del curso no disponibles');
      }

      setCourse(data.course);
    } catch (fetchError) {
      console.error('Error fetching course:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'Error desconocido al cargar el curso');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async () => {
    if (!isLoggedIn) {
      const shouldRedirect = confirm('Debe iniciar sesión para inscribirse al curso. ¿Desea ir a la página de login?');
      if (shouldRedirect) {
        router.push('/login');
      }
      return;
    }

    if (!user || !currentCourseId) {
      alert('Error: información de usuario o curso no disponible');
      return;
    }

    const confirmEnroll = confirm(`¿Está seguro que desea inscribirse al curso "${course?.title}"?`);
    if (!confirmEnroll) return;

    try {
      setEnrolling(true);

      const response = await fetch('/api/inscripcion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId: currentCourseId,
          userId: user.id
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('¡Inscripción exitosa! Te has inscrito al curso.');
        router.push('/mis-cursos');
      } else {
        throw new Error(responseData.message || responseData.error || 'Error en la inscripción');
      }
    } catch (error) {
      console.error('Error en inscripción:', error);
      alert(`Error al inscribirse al curso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setEnrolling(false);
    }
  };

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      const shouldRedirect = confirm('Debe iniciar sesión para comentar. ¿Desea ir a la página de login?');
      if (shouldRedirect) {
        router.push('/login');
      }
      return;
    }

    if (!user || !currentCourseId) {
      alert('Error: información de usuario o curso no disponible');
      return;
    }

    const comment = prompt('Ingrese su comentario:');
    if (!comment || comment.trim().length === 0) return;

    const ratingInput = prompt('Califique el curso (1-5):');
    if (!ratingInput) return;

    const rating = parseInt(ratingInput);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert('Por favor ingrese una calificación válida entre 1 y 5');
      return;
    }

    try {
      const response = await fetch('/api/comentarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId: currentCourseId,
          userId: user.id,
          comment: comment.trim(),
          rating: rating
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Comentario agregado exitosamente');
        await fetchCourseData(currentCourseId);
      } else {
        throw new Error(responseData.message || responseData.error || 'Error al agregar comentario');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(`Error al agregar comentario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

  const renderTabContent = () => {
    if (!course) return null;

    switch (activeTab) {
      case 'resumen':
        return (
          <div className={styles.tabContent}>
            <h3>DESCRIPCIÓN DEL CURSO</h3>
            <p>{course.description}</p>

            {course.subject && (
              <>
                <h3>MATERIA</h3>
                <p>{course.subject}</p>
              </>
            )}

            {course.levelDescription && (
              <>
                <h3>NIVEL DEL CURSO</h3>
                <p>{course.levelDescription}</p>
              </>
            )}

            {course.learningTopics && course.learningTopics.length > 0 && (
              <>
                <h3>¿QUÉ APRENDERÉ EN ESTE CURSO?</h3>
                <ul>
                  {course.learningTopics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </>
            )}

            {course.minStudents && course.minStudents > 1 && (
              <>
                <h3>REQUISITOS</h3>
                <p>Mínimo {course.minStudents} estudiantes para iniciar el curso.</p>
              </>
            )}
          </div>
        );

      case 'lecciones':
        return (
          <div className={styles.tabContent}>
            <h3>CONTENIDO DEL CURSO</h3>
            <div className={styles.lessonsList}>
              {course.lessonsList && course.lessonsList.length > 0 ? (
                course.lessonsList.map((lesson) => (
                  <div key={lesson.id} className={styles.lessonItem}>
                    <div className={styles.lessonNumber}>UNIDAD {lesson.id}:</div>
                    <div className={styles.lessonTitle}>{lesson.title}</div>
                    <div className={styles.lessonDescription}>{lesson.description}</div>
                  </div>
                ))
              ) : (
                <div className={styles.noContent}>
                  <p>No hay lecciones disponibles para este curso.</p>
                  <p>El contenido será actualizado próximamente.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'tutor':
        return (
          <div className={styles.tabContent}>
            <div className={styles.tutorCard}>
              <div className={styles.tutorHeader}>
                <div className={styles.tutorImage}>
                  <img
                    src={course.tutor.image}
                    alt={course.tutor.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/avatar2.png';
                    }}
                  />
                </div>
                <div className={styles.tutorInfo}>
                  <h3 className={styles.tutorName}>{course.tutor.name}</h3>
                  {course.tutor.email && (
                    <p className={styles.tutorEmail}>✉️ {course.tutor.email}</p>
                  )}
                  <div className={styles.tutorBadge}>Sobre mí:</div>
                </div>
              </div>
              <p className={styles.tutorDescription}>{course.tutor.description}</p>
            </div>
          </div>
        );

      case 'reseñas':
        return (
          <div className={styles.tabContent}>
            <div className={styles.reviewsSection}>
              <div className={styles.reviewsHeader}>
                <h3>Reseñas ({course.reviewCount})</h3>
                <button
                  className={styles.commentButton}
                  onClick={handleAddComment}
                >
                  {isLoggedIn ? 'Agregar Comentario' : 'Iniciar Sesión para Comentar'}
                </button>
              </div>

              {course.rating > 0 && (
                <div className={styles.ratingOverview}>
                  <div className={styles.overallRating}>
                    <span className={styles.ratingNumber}>{course.rating}</span>
                    <div className={styles.ratingStars}>
                      {renderStars(course.rating)}
                    </div>
                    <span className={styles.ratingText}>
                      Basado en {course.reviewCount} reseña{course.reviewCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              <div className={styles.reviewsList}>
                {!course.reviews || course.reviews.length === 0 ? (
                  <div className={styles.noReviews}>
                    <p>No hay reseñas disponibles para este curso.</p>
                    <p>¡Sé el primero en comentar!</p>
                  </div>
                ) : (
                  course.reviews.map((review) => (
                    <div key={review.id} className={styles.reviewItem}>
                      <div className={styles.reviewUser}>
                        <img
                          src={review.userImage}
                          alt={review.userName}
                          className={styles.reviewUserImage}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/avatar.png';
                          }}
                        />
                        <div className={styles.reviewUserInfo}>
                          <div className={styles.reviewUserName}>{review.userName}</div>
                          <div className={styles.reviewStars}>
                            {renderStars(review.rating)}
                          </div>
                          {review.date && (
                            <div className={styles.reviewDate}>{review.date}</div>
                          )}
                          <div className={styles.reviewComment}>{review.comment}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando información del curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <div className={styles.errorButtons}>
            <button
              className={styles.retryButton}
              onClick={() => currentCourseId && fetchCourseData(currentCourseId)}
            >
              Intentar nuevamente
            </button>
            <button
              className={styles.backButton}
              onClick={handleGoBack}
            >
              ← Volver Atrás
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Curso no encontrado</h2>
          <p>El curso que buscas no existe o no está disponible.</p>
          <div className={styles.errorButtons}>
            <button
              className={styles.retryButton}
              onClick={() => currentCourseId && fetchCourseData(currentCourseId)}
            >
              Intentar nuevamente
            </button>
            <button
              className={styles.backButton}
              onClick={handleGoBack}
            >
              ← Volver Atrás
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.backButtonContainer}>
        <button
          className={styles.backButton}
          onClick={handleGoBack}
        >
          ← Volver Atrás
        </button>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.courseImage}>
          <img
            src={course.image}
            alt={course.title}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/detalle.png';
            }}
          />
        </div>

        <div className={styles.courseInfo}>
          <div className={styles.rating}>
            {renderStars(course.rating)}
            <span className={styles.ratingNumber}>({course.rating})</span>
            {course.reviewCount > 0 && (
              <span className={styles.reviewCount}> - {course.reviewCount} reseña{course.reviewCount !== 1 ? 's' : ''}</span>
            )}
          </div>

          <h1 className={styles.courseTitle}>{course.title}</h1>

          <div className={styles.courseDetails}>
            <div className={styles.detailItem}>
              <span className={styles.icon}>📚</span>
              <span>Lecciones: {course.lessons}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.icon}>🕐</span>
              <span>{course.schedule}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.icon}>📖</span>
              <span>Modalidad: {course.modality}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.icon}>📊</span>
              <span>Nivel: {course.level}</span>
            </div>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'resumen' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('resumen')}
            >
              Resumen
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'lecciones' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('lecciones')}
            >
              Lecciones ({course.lessons})
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'tutor' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('tutor')}
            >
              Tutor
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'reseñas' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('reseñas')}
            >
              Reseñas ({course.reviewCount})
            </button>
          </div>

          {renderTabContent()}
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.priceCard}>
          <div className={styles.priceSection}>
            <span className={styles.label}>Precio Del Curso</span>
            <div className={styles.priceContainer}>
              <span className={styles.currency}>Bs.</span>
              <span className={styles.price}>{course.price.toFixed(2)}</span>
            </div>
          </div>

          <Link href={`/InscribirseCursoEst?id=${course.id}`}>
            <button
              className={`${styles.enrollButton} ${enrolling ? styles.enrolling : ''}`}
              disabled={enrolling}
            >
              {enrolling ? 'PROCESANDO...' : (isLoggedIn ? 'INSCRIBIRME AHORA' : 'INICIAR SESIÓN PARA INSCRIBIRSE')}
            </button>
          </Link>

          {!isLoggedIn && (
            <div className={styles.authMessage}>
              <p>Debe iniciar sesión o registrarse para inscribirse al curso</p>
              <button
                className={styles.loginLink}
                onClick={() => router.push('/login')}
              >
                Ir a la página de login
              </button>
            </div>
          )}

          <div className={styles.courseMetadata}>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Horario</span>
              <span className={styles.metadataValue}>{course.schedule}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Fecha De Inicio</span>
              <span className={styles.metadataValue}>{course.startDate}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Lecciones</span>
              <span className={styles.metadataValue}>{course.lessons}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Modalidad</span>
              <span className={styles.metadataValue}>{course.modality}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Nivel</span>
              <span className={styles.metadataValue}>{course.level}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Días De Clase</span>
              <span className={styles.metadataValue}>{course.duration}</span>
            </div>
            {course.subject && (
              <div className={styles.metadataRow}>
                <span className={styles.metadataLabel}>Materia</span>
                <span className={styles.metadataValue}>{course.subject}</span>
              </div>
            )}
            {course.minStudents && course.minStudents > 1 && (
              <div className={styles.metadataRow}>
                <span className={styles.metadataLabel}>Mín. Estudiantes</span>
                <span className={styles.metadataValue}>{course.minStudents}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;