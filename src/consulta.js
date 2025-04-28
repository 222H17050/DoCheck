// consulta.js
import { 
    db, 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    doc, 
    deleteDoc 
  } from './firebase.js'; // Ruta relativa correcta
import { HorarioService } from "./horario.js";

export class Consulta {
  constructor({ idUsuario, idDoctor, especialidad, nombreDoctor, fecha, motivo, idHorario }) {
    this.idUsuario = idUsuario;
    this.idDoctor = idDoctor;
    this.especialidad = especialidad;
    this.nombreDoctor = nombreDoctor;
    this.fecha = fecha;
    this.motivo = motivo;
    this.idHorario = idHorario;
  }

  toFirestore() {
    return {
      id_usuario: this.idUsuario,
      id_doctor: this.idDoctor,
      especialidad: this.especialidad,
      nombre_doctor: this.nombreDoctor,
      fecha: this.fecha,
      motivo: this.motivo,
      id_horario: this.idHorario
    };
  }
}

export const ConsultaService = {
  async crear(consultaData) {
    const consulta = new Consulta(consultaData);
    return await addDoc(collection(db, "consultas"), consulta.toFirestore());
  },

  async listarPorUsuario(userId) {
    const q = query(
      collection(db, "consultas"),
      where("id_usuario", "==", userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async listarConDetalles(userId) {
    const citas = await this.listarPorUsuario(userId);
    
    const citasConDetalles = await Promise.all(
      citas.map(async cita => {
        // Obtener el horario completo desde disponibilidad
        const disponibilidad = await HorarioService.listarDisponibles(
          cita.id_doctor, 
          cita.fecha
        ).then(horarios => horarios.find(h => h.id_horario === cita.id_horario));
        
        return {
          ...cita,
          hora: disponibilidad?.hora_inicio || 'Por definir',
          ubicacion: "Consultorio " + (Math.floor(Math.random() * 500) + 100) // Ejemplo
        };
      })
    );
    
    return citasConDetalles.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  },

  async cancelar(idConsulta) {
    await deleteDoc(doc(db, "consultas", idConsulta));
  }
};