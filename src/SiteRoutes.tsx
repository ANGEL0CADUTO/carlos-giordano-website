import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Works from './pages/Works';
import ArtworkCategory from './pages/ArtworkCategory';
import About from './pages/About';
import Exhibitions from './pages/Exhibitions';
import ExhibitionDetail from './pages/ExhibitionDetail';
import Videos from './pages/Videos';
import Press from './pages/Press';
import News from './pages/News';
import Contact from './pages/Contact';

// The same route tree is rendered at build time and hydrated in the browser.
export default function SiteRoutes() {
  return (
    <AnimatePresence initial={false}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="opere" element={<Works />} />
          <Route path="opere/video" element={<Videos />} />
          <Route path="opere/:categoryId" element={<ArtworkCategory />} />
          <Route path="opere/:categoryId/:subcategoryId" element={<ArtworkCategory />} />
          <Route path="chi-sono" element={<About />} />
          <Route path="mostre" element={<Exhibitions />} />
          <Route path="mostre/:exhibitionSlug" element={<ExhibitionDetail />} />
          <Route path="dicono-di-me" element={<Press />} />
          <Route path="news" element={<News />} />
          <Route path="contatti" element={<Contact />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
