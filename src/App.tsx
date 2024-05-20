import React from 'react';
import './App.css';

function App() {
  return (
      <div className="flex justify-between items-center py-4 bg-blue-900">
          <div className="flex-shrink-0 ml-10 cursor-pointer">
              <i className="fas fa-drafting-compass fa-2x text-orange-500"></i>
              <span className="ml-1 text-3xl text-blue-200 font-semibold">Viblo</span>
          </div>
          <i className="fas fa-bars fa-2x visible md:invisible mr-10 md:mr-0 text-blue-200 cursor-pointer"></i>
          <ul className="hidden md:flex overflow-x-hidden mr-10 font-semibold">
              <li className="mr-6 p-1 border-b-2 border-orange-500">
                  <a className="text-blue-200 cursor-default" href="#">Home</a>
              </li>
              <li className="mr-6 p-1">
                  <a className="text-white hover:text-blue-300" href="#">Services</a>
              </li>
              <li className="mr-6 p-1">
                  <a className="text-white hover:text-blue-300" href="#">Projects</a>
              </li>
              <li className="mr-6 p-1">
                  <a className="text-white hover:text-blue-300" href="#">Team</a>
              </li>
              <li className="mr-6 p-1">
                  <a className="text-white hover:text-blue-300" href="#">About</a>
              </li>
              <li className="mr-6 p-1">
                  <a className="text-white hover:text-blue-300" href="#">Contacts</a>
              </li>
          </ul>
      </div>
  );
}

export default App;