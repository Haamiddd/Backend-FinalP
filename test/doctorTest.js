const request = require('supertest');
const app = require('../server'); // Import your Express app
const DoctorService = require('../services/DoctorService'); // Import the service if you want to mock service calls
const sinon = require('sinon');

describe('Doctor API', () => {
    afterEach(() => {
        sinon.restore(); // Restore the original state of any stubs or mocks after each test
    });

    // Test the GET /doctors route
    describe('GET /api/doctors', () => {
        it('should return all doctors', async () => {
            // Stub the service that fetches all doctors
            sinon.stub(DoctorService, 'getAllDoctors').resolves([{ doctor_id: 1, name: 'Dr. John' }]);

            const res = await request(app).get('/api/doctors');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ doctor_id: 1, name: 'Dr. John' }]);
        });
    });

    // Test the GET /doctors/:doctor_id route
    describe('GET /api/doctors/:doctor_id', () => {
        it('should return a doctor by ID', async () => {
            const doctorId = 1;
            // Stub the service that fetches a doctor by ID
            sinon.stub(DoctorService, 'getDoctorById').resolves({ doctor_id: doctorId, name: 'Dr. John' });

            const res = await request(app).get(`/api/doctors/${doctorId}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ doctor_id: doctorId, name: 'Dr. John' });
        });

        it('should return 404 if doctor not found', async () => {
            const doctorId = 999;
            sinon.stub(DoctorService, 'getDoctorById').resolves(null);

            const res = await request(app).get(`/api/doctors/${doctorId}`);
            expect(res.status).toBe(404);
        });
    });

    // Test the POST /doctors route
    describe('POST /api/doctors', () => {
        it('should create a new doctor', async () => {
            const newDoctor = {
                name: 'Dr. Jane',
                specialty: 'Dermatology',
                email: 'dr.jane@example.com',
                phone: '1234567890',
                password: 'password123'
            };

            // Stub the service that creates a doctor
            sinon.stub(DoctorService, 'createDoctor').resolves(1); // Assuming the ID of the new doctor is 1

            const res = await request(app).post('/api/doctors').send(newDoctor);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id', 1); // Check if the returned ID is correct
        });
    });

    // Test the PUT /doctors/:doctor_id route
    describe('PUT /api/doctors/:doctor_id', () => {
        it('should update a doctor', async () => {
            const doctorId = 1;
            const updatedDoctor = {
                name: 'Dr. Updated Name',
                email: 'dr.updated@example.com'
            };

            // Stub the service that updates the doctor
            sinon.stub(DoctorService, 'updateDoctor').resolves(); // Resolve with no value as we're not expecting data back

            const res = await request(app).put(`/api/doctors/${doctorId}`).send(updatedDoctor);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Doctor updated successfully');
        });
    });

    // Test the DELETE /doctors/:doctor_id route
    describe('DELETE /api/doctors/:doctor_id', () => {
        it('should delete a doctor by ID', async () => {
            const doctorId = 1;

            // Stub the service that deletes the doctor
            sinon.stub(DoctorService, 'deleteDoctor').resolves();

            const res = await request(app).delete(`/api/doctors/${doctorId}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Doctor deleted successfully');
        });
    });

    // Test the POST /doctor/login route
    describe('POST /api/doctor/login', () => {
        it('should log in a doctor with correct credentials', async () => {
            const credentials = {
                email: 'dr.jane@example.com',
                password: 'password123'
            };

            // Stub the login function to return a doctor object
            sinon.stub(DoctorService, 'login').resolves({
                doctor_id: 1,
                name: 'Dr. Jane',
                email: 'dr.jane@example.com'
            });

            const res = await request(app).post('/api/doctor/login').send(credentials);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('doctor_id', 1);
        });

        it('should return 401 for incorrect credentials', async () => {
            const credentials = {
                email: 'wrong@example.com',
                password: 'wrongpassword'
            };

            // Stub the login function to return null (indicating failed login)
            sinon.stub(DoctorService, 'login').resolves(null);

            const res = await request(app).post('/api/doctor/login').send(credentials);
            expect(res.status).toBe(401);
        });
    });
});
