import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-3xl text-white">🎯</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Queue Joy</h1>
        <p className="text-lg text-gray-600 mb-8">Professional queue management system for clinics, offices, and service centers</p>
        
        <div className="space-y-4">
          <Link to="/counter">
            <Button className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg">
              🔧 Counter Management
            </Button>
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="py-3 font-semibold rounded-xl">
              📊 Admin Panel
            </Button>
            <Button variant="outline" className="py-3 font-semibold rounded-xl">
              📈 Analytics
            </Button>
          </div>
          
          <Button variant="outline" className="w-full py-3 font-semibold rounded-xl">
            🎮 Demo Game
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          Select an option to get started
        </div>
      </div>
    </div>
  );
};

export default Index;
