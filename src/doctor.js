import { db, getCollection, query, where } from "./firebase.js";

// Modelo
export class Doctor {
  constructor({ nombre, especialidad }) {
    this.nombre = nombre;
    this.especialidad = especialidad;
  }
}

// Servicio
export const DoctorService = {
  async listarTodos() {
    return await getCollection("doctores");
  },

  async listarPorEspecialidad(especialidad) {
    const q = query(
      collection(db, "doctores"),
      where("especialidad", "==", especialidad)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};