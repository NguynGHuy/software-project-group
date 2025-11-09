import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import MapView from "../pages/mapview";

function Layout() {
  return (
    <div style={{display: "flex"}}>
      <Sidebar />
      <div style={{flex: 1}}>
        <Header />
        
        <MapView />   {/* replace body content */}

      </div>
    </div>
  );
}

export default Layout;
