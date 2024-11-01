const request = require('supertest');
const server = require('../server'); // Path to your Express app
const sinon = require('sinon');
const AppointmentService = require('../services/AppointmentService');

describe('Appointment API', () => {
    // Test GET all appointments
    describe('GET /api/appointments', () => {
        it('should GET all appointments', async () => {
            const mockAppointments = [
                { appointment_id: 1, patient_id: 1, doctor_id: 1, status: 'Pending' },
                { appointment_id: 2, patient_id: 2, doctor_id: 1, status: 'Confirmed' }
            ];

            sinon.stub(AppointmentService, 'getAllAppointments').resolves(mockAppointments);

            const res = await request(server)
                .get('/api/appointments')
                .expect(200);

            res.body.should.be.an('array');
            res.body.length.should.be.eql(2);

            AppointmentService.getAllAppointments.restore();
        });
    });

    // Test GET appointment by ID
    describe('GET /api/appointments/:appointment_id', () => {
        it('should GET a single appointment by ID', async () => {
            const mockAppointment = { appointment_id: 1, patient_id: 1, doctor_id: 1, status: 'Pending' };

            sinon.stub(AppointmentService, 'getAppointmentById').resolves(mockAppointment);

            const res = await request(server)
                .get('/api/appointments/1')
                .expect(200);

            res.body.should.be.an('object');
            res.body.should.have.property('appointment_id').eql(1);

            AppointmentService.getAppointmentById.restore();
        });
    });

    // Test POST new appointment
    describe('POST /api/appointments', () => {
        it('should POST a new appointment', async () => {
            const newAppointment = {
                patient_id: 1,
                doctor_id: 1,
                appointment_date: '2024-12-01',
                appointment_time: '14:00',
                appointment_type: 'InPerson',
                status: 'Pending',
                payment_status: 'Pending',
                payment_amount: 100.0
            };

            sinon.stub(AppointmentService, 'createAppointment').resolves(3); // Mocking the new appointment ID

            const res = await request(server)
                .post('/api/appointments')
                .send(newAppointment)
                .expect(201);

            res.body.should.have.property('id').eql(3);

            AppointmentService.createAppointment.restore();
        });
    });

    // Test PUT update appointment
    describe('PUT /api/appointments/:appointment_id', () => {
        it('should UPDATE an appointment', async () => {
            const updatedAppointment = {
                patient_id: 1,
                doctor_id: 1,
                appointment_date: '2024-12-01',
                appointment_time: '14:00',
                appointment_type: 'InPerson',
                status: 'Confirmed',
                payment_status: 'Paid',
                payment_amount: 100.0
            };

            sinon.stub(AppointmentService, 'updateAppointment').resolves();

            const res = await request(server)
                .put('/api/appointments/1')
                .send(updatedAppointment)
                .expect(200);

            res.body.should.have.property('message').eql('Appointment updated successfully');

            AppointmentService.updateAppointment.restore();
        });
    });

    // Test DELETE appointment
    describe('DELETE /api/appointments/:appointment_id', () => {
        it('should DELETE an appointment', async () => {
            sinon.stub(AppointmentService, 'deleteAppointment').resolves();

            const res = await request(server)
                .delete('/api/appointments/1')
                .expect(200);

            res.body.should.have.property('message').eql('Appointment deleted successfully');

            AppointmentService.deleteAppointment.restore();
        });
    });
});
