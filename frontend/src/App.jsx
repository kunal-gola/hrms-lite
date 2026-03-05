import { use, useCallback, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { fetchEmployees, fetchTodayAttendance, deleteEmployeeRecord, createEmployee, saveAttendance, fetchAttendance } from './services/apis'

import { CardSmall } from './components/SmallCard'
import { EmployeeTable } from './components/EmployeeTable'
import { EmployeeForm } from './components/EmployeeForm'
import { AttendanceForm } from './components/AttendanceForm'
import { AttendanceTable } from './components/AttendanceTable'

function App() {
  const [count, setCount] = useState(0)

  //   states
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState(0);
  const [todayPresent, setTodayPresent] = useState(0);
  const [todayAbsent, setTodayAbsent] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [deletingEmployeeID, setEmployeeIDForDeleting] = useState(null);
  const [addingEmployee, setSavingNewEmployee] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [employeeAttendance, setEmployeeAttendance] = useState([]);

  const [employeeCreationError, setEmployeeCreationError] = useState('');
  const [currentSelectedEmployee, setCurrentSelectedEmployee] = useState(null);

  // loading states
  const [loadingEmployees, setLoadingEMP] = useState(false);
  const [loadingAttenCount, setAttenLoading] = useState(false);

  // first time loads
  const loadEmployees = useCallback( async() => {
    setLoadingEMP(true);
    console.log("entered here2");
    try {
      const data = await fetchEmployees();
      console.log("entered here3");
      console.log(data['employees']);
      setEmployees(data['employees']);
      setTotalEmployees(data['employees'].length)
    } catch (error) {
      // setting up error messages
    }
    finally{
      setLoadingEMP(false);
    }
  }, []);

  const loadTodayAttendance = useCallback( async () => {
    setAttenLoading(true);

    try {
      const data = await fetchTodayAttendance();
      console.log(data['attendance_count']);
      setTodayAttendance(data['attendance_count']);
      setTodayPresent(data['present_today']);
      setTodayAbsent(data['absent_today']);
    } catch (error) {
      
    }finally{
      setAttenLoading(false);
    }
  }, []);

  useEffect( () => {
    console.log("entered here");
    loadEmployees();
    loadTodayAttendance();
  }, [loadEmployees, loadTodayAttendance]);




    //   handling events
    async function handleDeleteEmployee(emp_id){
        const confirmed = window.confirm('You sure, you want to delete this employee and all linked attendance records?');
        if (!confirmed) return;

        setEmployeeIDForDeleting(emp_id);
        try {
            const resp = await deleteEmployeeRecord(emp_id);
            console.log(resp)
            await loadEmployees();
            await loadTodayAttendance();
        } catch (error) {
            
        }finally{
            setEmployeeIDForDeleting(null);
        }
    }

    async function addEmployee(data){
        setSavingNewEmployee(true);
        setEmployeeCreationError('');
        try {
            const resp = await createEmployee(data);
            console.log(resp);

            if (resp['status'] != 'ok'){
                // set error message
                setEmployeeCreationError(resp['message']);
            }
            else{
                // can just simply append the newly added employee to state
                await loadEmployees();
            }
        } catch (error) {
            
        }finally{
            setSavingNewEmployee(false);
        }
    }

    async function addAttendance(data) {
        
        setSavingAttendance(true);
        try {
            const resp = await saveAttendance(data);
            console.log(resp);
            loadTodayAttendance();
        } catch (error) {
            
        }finally{
            setSavingAttendance(false);
        }
    }
  
    async function handleCurrentSelectedEmployee(emp_id){
        setCurrentSelectedEmployee(emp_id);
        try {
            let resp = await fetchAttendance(emp_id);

            console.log(resp);
            setEmployeeAttendance(resp['attendances']);
        } catch (error) {
            
        }finally{

        }
    }

  return (
    <>
      <div className='app'>

        <header className="heading">
            <p className="heading-top">Full-Stack Coding Assignment</p>
            <h1 className='text-6xl'>HRMS Lite</h1>
            <p className="heading description">Employee and attendance management - web-based HRMS Lite application</p>
        </header>

        <section>
            <CardSmall className="w-full"
                title="Overview" description="Real-time summary across employees and attendance records.">
                <CardSmall title="Employees" description={totalEmployees} />
                <CardSmall title="Today's Attendance" description={todayAttendance} />
                <CardSmall title="Today's Present" description={todayPresent} />
                <CardSmall title="Today's Absent" description={todayAbsent} />
            </CardSmall>

            <div className='block md:flex gap-4'>
                {/* <CardSmall 
                    title="Add New Employee"
                    description="Enter details for new Employee"
                >
                </CardSmall> */}
                    <EmployeeForm 
                        onFormSubmit={addEmployee}
                        loading={addingEmployee}
                        errorMessage={employeeCreationError}
                    />

                    <AttendanceForm 
                        employees={employees}
                        onFormSubmit={addAttendance}
                        loading={savingAttendance}
                    />


            </div>


            <CardSmall className="w-full"
                title="Employees Record"
                description="Employees database, select an employee to view their attendance."
                >
                    <EmployeeTable 
                        employees={employees}
                        onDelete={handleDeleteEmployee}
                        deletingEmployeeID={deletingEmployeeID}
                        setCurrentSelectedEmployee={handleCurrentSelectedEmployee}
                    >

                    </EmployeeTable>
            </CardSmall>


            <CardSmall className="w-full"
                title="Attendance Record"
                description="showing record for employee."
            >
                <AttendanceTable 
                    attendances={employeeAttendance}
                />
            </CardSmall>
        </section>

      </div>
      
    </>
  )
}

export default App
