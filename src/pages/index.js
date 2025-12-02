import HomeOne from "./HomeOne";
import HomeThree from "./HomeThree";
import HomePage from "./HomePage";
import Project1 from "./Project1";
import Project2 from "./Project2";
import Project3 from "./Project3";
import Project4 from "./Project4";
import Project5 from "./Project5";
import ProjectList from "./ProjectList";
import ProjectDetails from "./Histoire";
import SubmitProject from "./SubmitProject";
import Token from "./Token";
import ConnectWallet from "./ConnectWallet";
import TeamDetails from "./TeamDetails";
import SubmitIGO from "./SubmitIGO";
import Editions from "./Editions";
import CarnaEnfant  from "./CarnaEnfant";
import Login from "./Login";
import Register from "./Register";
import ForgetPass from "./ForgetPass";
import Roadmap from "./Roadmap";
import BlogGrid from "./BlogGrid";
import BlogList from "./BlogList";
import Histoire from "./Histoire";
import Contact from "./Contact";
import PageFaqs from "./PageFaqs";


const routes = [

  { path: '/', component: <HomePage />},
  { path: '/faqs', component: <PageFaqs />},
  { path: '/histoire', component: <Histoire />},
  { path: '/contact', component: <Contact />},
  { path: '/edition', component: <Editions />},
  { path: '/carna_enfant', component: <CarnaEnfant />},




]

export default routes;