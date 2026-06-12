import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Home } from './pages/Home';
import { Kalkulator } from './pages/Kalkulator';
import { Referensi } from './pages/Referensi';
import { Placeholder } from './pages/Placeholder';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'teori', element: <Placeholder title="Teori" /> },
      { path: 'skoring', element: <Placeholder title="Skoring" /> },
      { path: 'kalkulator', element: <Kalkulator /> },
      { path: 'drugs-fluids', element: <Placeholder title="Drugs & Fluids" /> },
      { path: 'monitoring', element: <Placeholder title="Monitoring & Weaning" /> },
      { path: 'referensi', element: <Referensi /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
