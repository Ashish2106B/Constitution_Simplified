import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <>
      <Navbar />

      <div className="learning-layout">
        <Sidebar />

        <main className="learning-content">{children}</main>
      </div>
    </>
  );
}

export default Layout;
