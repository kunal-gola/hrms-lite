from django.urls import re_path, path
from . import views

app_name = 'main'
urlpatterns = [
    path('create_employee', views.create_employee, name="create_employee"),
    path('delete_employee', views.delete_employee, name='delete_employee'),
    path('list_employees', views.view_all_employees, name='list_employees'),
    path('today_attendance', views.today_attendance, name='today_attendance'),
    path('save_attendance', views.save_attendance, name="save_attendance"),
    path('get_attendance', views.get_attendance, name="get_attendance")
]