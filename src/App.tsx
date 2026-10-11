import { BrowserRouter } from 'react-router-dom';
import Seo from './components/Seo';
import SiteRoutes from './SiteRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <Seo />
      <SiteRoutes />
    </BrowserRouter>
  );
}
