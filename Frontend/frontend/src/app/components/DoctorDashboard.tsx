interface DoctorDashboardProps {
    user: any;
    onLogout: () => void;
  }
  
  export function DoctorDashboard({
    user,
    onLogout,
  }: DoctorDashboardProps) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-4">Doctor Dashboard</h1>
        <p className="mb-4">Welcome, Dr. {user.name}</p>
  
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </div>
    );
  }