from django.shortcuts import render

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from .models import Employee, Attendance

from datetime import date
from datetime import datetime

# Create your views here.


def view_all_employees(request):

    try:
        employees = list(Employee.objects.all().values())

        return JsonResponse(
            {
                'status': 'ok',
                'employees': employees,
                'code': 200
            }
        )
    except Exception as e:
        return return_error(str(e))


@csrf_exempt
@require_POST
def create_employee(request):

    # request sample
    # {
    #  "employeeId": "EMP001",
    #  "fullName": "John Doe",
    #  "email": "john@example.com",
    #  "department": "IT"
    # }
    emp_id = ""
    full_name = ""
    email = ""
    department = ""
    message = ""

    print(request.POST)

    try:
        emp_id = request.POST['employee_id']
        full_name = request.POST['full_name']
        email = request.POST['email']
        department = request.POST['department']

        # validate email
        validate_email(email)

        # employee exist check

        emp = Employee.objects.filter(employee_id = emp_id)
        if len(emp) != 0:
            message = "Employee already exist."
            return return_error(message)

        # email unique check
        emp = Employee.objects.filter(email = email)
        if len(emp) != 0:
            message = "Email already registered with some other employee."
            return return_error(message)

    except ValidationError as e:
        message = str(e)
        return return_error(message)

    except KeyError as e:
        message = "value is not provided for :" + str(e)
        return return_error(message)

    except Exception as e:
        message = str(e)
        return return_error(message)

    # department check
    employee_departments = [e[0] for e in Employee._meta.get_field('department').choices]

    if department not in employee_departments:
        message = "Department does not exist, create new Department."
        return return_error(message)

    employee = Employee(
        employee_id = emp_id,
        email = email,
        full_name = full_name,
        department = department
    )

    employee.save()
    message = "Employee added successfully."
    return JsonResponse(
        {
            "status": "ok",
            "code": 200,
            "message": message
        }
    )


@csrf_exempt
@require_POST
def delete_employee(request):

    emp_id = None
    print(request.POST)
    try:
        emp_id = request.POST['employee_id']
    except KeyError as e:
        message = "value is not provided for :" + str(e)
        return return_error(message)

    try:
        employee = Employee.objects.get(employee_id=emp_id)
        employee.delete()

        return JsonResponse({'status': 'ok', 'message': 'successfully deleted.'})
    except Exception as e:
        message = str(e)
        return return_error(message)


def custom_404(request, exception):
    return JsonResponse({
        "error": "Endpoint not found",
        "status": 404,
        "message": "The requested URL does not exist."
    }, status=404)


def today_attendance(request):

    try:
        today = date.today()
        atten_count = Attendance.objects.filter(date=today).count()
        present_today = Attendance.objects.filter(date=today, status="PRESENT").count()
        absent_today = Attendance.objects.filter(date=today, status="ABSENT").count()

        return JsonResponse(
            {
                'status': 'ok',
                'attendance_count': atten_count,
                'present_today': present_today,
                'absent_today': absent_today
            }
        )
    except Exception as e:
        return return_error(str(e))


@csrf_exempt
@require_POST
def save_attendance(request):

    try:
        emp_id = request.POST['employee_id']
        employee = Employee.objects.get(employee_id=emp_id)

        date = request.POST['date']
        status = request.POST['status']

        formatted_date = datetime.strptime(date, "%Y-%m-%d").date()

        attan = Attendance(employee=employee, date=formatted_date, status=status)
        attan.save()

        return JsonResponse(
            {
                'status': 'ok',
                'code': 200,
                'message': 'attendance added successfully.'
            }
        )

    except KeyError as e:
        return return_error(str(e), " is not provided.")
    except Exception as e:
        return return_error(str(e))


def get_attendance(request):

    try:
        emp_id = request.GET['employee_id']
        employee = Employee.objects.get(employee_id=emp_id)

        attendance = Attendance.objects.filter(employee=employee)

        data = []
        for atten in attendance:
            data.append({
                    'employee_id': atten.employee.employee_id,
                    'date': atten.date.strftime("%Y-%m-%d"),
                    'full_name': atten.employee.full_name,
                    'status': atten.status
                })


        return JsonResponse(
            {
                'status': 'ok',
                'code': 200,
                'attendances': data
            }
        )

    except KeyError as e:
        return return_error(str(e), " is not provided.")
    except Exception as e:
        return return_error(str(e))


def return_error(message):

    return JsonResponse(
        {
            "status": "error",
            "message": message
        }
    )