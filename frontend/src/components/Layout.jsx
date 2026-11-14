import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="learning-layout">
        <Sidebar />
        <main className="learning-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
