const request = require('supertest');
const server = require('../server');  // Assuming the Express app is exported from server.js

describe('Patients API', () => {
  // Test the GET /patients route
  describe('GET /patients', () => {
    it('should GET all the patients', async () => {
      const res = await request(server).get('/api/patients');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);  // Check that the response is an array
    });
  });

  // Test the POST /patients route
  describe('POST /patients', () => {
    it('should POST a new patient', async () => {
      const patient = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        address: "123 Main St",
        dob: "1985-07-15",
        insurance_details: "ABC Insurance, Policy #12345",
        emergency_contact_name: "Jane Doe",
        emergency_contact_phone: "0987654321"
      };
      const res = await request(server).post('/api/patients').send(patient);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');  // Assuming response contains an 'id' field for the created patient
    });
  });

  // Test the GET /patients/:id route
  describe('GET /patients/:id', () => {
    it('should GET a patient by the given ID', async () => {
      const patientId = 1;  // Replace with a valid patient ID from your DB
      const res = await request(server).get(`/api/patients/${patientId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('patient_id');
      expect(res.body).toHaveProperty('name');
    });
  });

  // Test the PUT /patients/:id route
  describe('PUT /patients/:id', () => {
    it('should UPDATE a patient by the given ID', async () => {
      const patientId = 1;  // Replace with a valid patient ID
      const updatedPatient = {
        name: "Updated Name",
        email: "updated.email@example.com"
      };
      const res = await request(server).put(`/api/patients/${patientId}`).send(updatedPatient);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Patient updated successfully');
    });
  });

  // Test the DELETE /patients/:id route
  describe('DELETE /patients/:id', () => {
    it('should DELETE a patient by the given ID', async () => {
      const patientId = 1;  // Replace with a valid patient ID
      const res = await request(server).delete(`/api/patients/${patientId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Patient deleted successfully');
    });
  });
});
