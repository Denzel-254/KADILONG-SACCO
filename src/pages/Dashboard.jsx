const Dashboard = ({ user }) => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.full_name}!</h1>
      <p className="text-gray-600">Dashboard coming soon...</p>
    </div>
  );
};

export default Dashboard;