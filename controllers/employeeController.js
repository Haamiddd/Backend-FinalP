const employeeService = require('../services/employeeService');
const bcrypt = require('bcryptjs');

class EmployeeController {
    async getAllEmployees(req, res) {
        try {
            const employees = await employeeService.getAllEmployees();
            res.json(employees);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getEmployeeById(req, res) {
        try {
            const employee = await employeeService.getEmployeeById(req.params.employee_id);
            if (employee) {
                res.json(employee);
            } else {
                res.status(404).json({ message: 'Employee not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createEmployee(req, res) {
        try {
            console.log('Request Body:', req.body);
            const employeeId = await employeeService.createEmployee(req.body);
            res.status(201).json({ id: employeeId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateEmployee(req, res) {
        try {
            console.log('Request Body:', req.body);
            await employeeService.updateEmployee(req.params.employee_id, req.body);
            res.status(200).json({ message: 'Employee updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async deleteEmployee(req, res) {
        try {
            await employeeService.deleteEmployee(req.params.employee_id);
            res.status(200).json({ message: 'Employee deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        try {
            // Get employee by email
            const employee = await employeeService.getEmployeeByEmail(email);
            if (!employee) {
                return res.status(400).json({ message: 'Invalid email or password.' });
            }

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, employee.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid email or password.' });
            }

            // Return employee details to the frontend
            res.status(200).json({
                message: 'Login successful',
                employee: {
                    employee_id: employee.employee_id,
                    name: employee.name,
                    email: employee.email,
                    role: employee.role
                }
            });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    }

    
}

module.exports = new EmployeeController();
