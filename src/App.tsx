import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Home } from './pages/Home';
import { Kalkulator } from './pages/Kalkulator';
import { Referensi } from './pages/Referensi';
import { Skoring } from './pages/Skoring';
import { DrugsFluid } from './pages/DrugsFluid';
import { Teori } from './pages/Teori';
import { Monitoring } from './pages/Monitoring';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'teori', element: <Teori /> },
      { path: 'skoring', element: <Skoring /> },
      { path: 'kalkulator', element: <Kalkulator /> },
      { path: 'drugs-fluids', element: <DrugsFluid /> },
      { path: 'monitoring', element: <Monitoring /> },
      { path: 'referensi', element: <Referensi /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
