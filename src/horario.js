import { db, collection, query, where, getDocs } from "./firebase.js";

export class Horario {
  constructor({ horaInicio, horaFin }) {
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
  }
}

export const HorarioService = {
  async listarDisponibles(idDoctor, fecha) {
    const q = query(
      collection(db, "disponibilidad"),
      where("id_doctor", "==", idDoctor),
      where("fecha", "==", fecha),
      where("disponible", "==", true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      id_horario: doc.data().id_horario,
      hora_inicio: doc.data().hora_inicio,
      hora_fin: doc.data().hora_fin 
    }));
  },

  async obtenerPorId(idHorario) {
    const q = query(
      collection(db, "horarios"),
      where("__name__", "==", idHorario)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs[0]?.data();
  }
};