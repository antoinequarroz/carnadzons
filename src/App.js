import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import AOS from 'aos';
import routes from './pages';
import '../src/assets/fonts/font-awesome.css';
import Header from './components/header';
import Footer from './components/footer';
import Error404 from "./components/error404/Error404";

function App() {
  useEffect(() => {
    AOS.init({
      duration : 2000
    });
  }, []);

  return (
      <>
        <Header />

        <Routes>
          {routes.map((data, idx) => (
              <Route key={idx} path={data.path} element={<data.component />} />
          ))}

          {/* Route pour Error404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>

        <Footer />
      </>
  );
}

export default App;
