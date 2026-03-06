import { createBrowserRouter, replace, RouterProvider } from 'react-router'
import { BlogsList } from './components/BlogsList';
import { addBlogAction, adminLoader, blogDetailLoader, blogsListLoader, deleteBlogLoader, editBlogAction, editBlogLoader, loginAction, loginLoader, logout } from './services/loaders';
import { BlogDetail } from './components/BlogDetail';
import { ErrorPage } from './components/ErrorPage';
import { LoginPage } from './components/LoginPage';
import { Admin } from './components/Admin';
import { ProtectedRoute } from './components/Protectedroute';
import { AddBlog } from './components/AddBlog';
import { EditBlog } from './components/EditBlog';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: async() => replace('/home')
      },
      {
        path: 'home',
        element: <BlogsList />,
        loader: blogsListLoader,
      },
      {
        path: 'article/:id',
        element: <BlogDetail />,
        loader: blogDetailLoader,
      },
      {
        path: 'login',
        element: <LoginPage />,
        action: loginAction,
        loader: loginLoader,
      },
      {
        path: 'logout',
        loader: logout,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'admin',
            children: [
              {
                index: true,
                element: <Admin />,
                loader: adminLoader,
              },
              {
                path: 'new/article',
                element: <AddBlog />,
                action: addBlogAction,
              },
              {
                path: 'edit/article/:id',
                element: <EditBlog />,
                action: editBlogAction,
                loader: editBlogLoader
              },
              {
                path: 'delete/article/:id',
                loader: deleteBlogLoader,
              }
            ]
          }
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className='card'>
      <RouterProvider router={ router } />
    </div>
  )
}

export default App
