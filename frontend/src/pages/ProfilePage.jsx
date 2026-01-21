import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import UserProfile from '../components/user/UserProfile';

const ProfilePage = () => {
  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserProfile />
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
