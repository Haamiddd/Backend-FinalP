// queries/AppointmentQueries.js
module.exports = {
    getAppointments: "SELECT * FROM appointments WHERE user_id = ?",
    createAppointment: "INSERT INTO appointments (user_id, date, details) VALUES (?, ?, ?)",
    updateAppointment: "UPDATE appointments SET date = ?, details = ? WHERE appointment_id = ?",
    deleteAppointment: "DELETE FROM appointments WHERE appointment_id = ?"
  };
  