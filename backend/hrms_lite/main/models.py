from django.db import models

# Create your models here.


class Employee(models.Model):
	
	employee_id = models.CharField(max_length=200, unique=True, null=False)
	full_name = models.CharField(max_length=200, default='HRMS_LITE_EMPLOYEE', null=False)
	email = models.EmailField(max_length=200, null=False)
	DEPARTMENT_CHOICES = (
		("HR", "HR"),
		("FINANCE/ACCOUNTING", "FINANCE/ACCOUNTING"),
		("OPERATIONS", "OPERATIONS"),
		("IT", "IT"),
		("R&D", "R&D"),
		("Others", "Others"),
	)
	department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES, default='Others', null=False)
	created_at = models.DateTimeField(auto_now_add=True, null=False)

	def __str__(self):
		return self.employee_id + ", " + str(self.email) + " - " + self.full_name


class Attendance(models.Model):

	employee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=False)
	date = models.DateTimeField(null=False)
	STATUS_CHOICES = (
		("PRESENT", "PRESENT"),
		("ABSENT", "ABSENT"),
	)

	status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="ABSENT", null=False)
	created_at = models.DateTimeField(auto_now_add=True, null=False)

	def __str__(self):
		return str(self.date.date()) + " - " + self.employee.employee_id + " - " + self.status