import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <>
      <Navbar />

      <div>
        <Sidebar />

        <main>{children}</main>
      </div>
    </>
  );
}

export default Layout;
