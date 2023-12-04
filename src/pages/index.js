import HomeOne from "./HomeOne";
import HomeThree from "./HomeThree";
import HomePage from "./HomePage";
import Editions from "./Editions";
import CarnaEnfant  from "./CarnaEnfant";
import Histoire from "./Histoire";
import Contact from "./Contact";
import FAQs2 from "./FAQs2";


const routes = [

  { path: '/', component: <HomePage />},
  { path: '/faqs', component: <FAQs2 />},
  { path: '/histoire', component: <Histoire />},
  { path: '/contact', component: <Contact />},
  { path: '/edition', component: <Editions />},
  { path: '/carna_enfant', component: <CarnaEnfant />},




]

export default routes;