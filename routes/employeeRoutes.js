const express = require('express');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/:employee_id', employeeController.getEmployeeById);
router.post('/employees', employeeController.createEmployee);
router.put('/employees/:employee_id', employeeController.updateEmployee);
router.delete('/employees/:employee_id', employeeController.deleteEmployee);
router.post('/employee/login', employeeController.login);

module.exports = router;
