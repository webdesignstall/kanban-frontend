import "./App.css";
import "../bootstrap.css";
import DashboardLayout from "./layout/Layout";
import useLocalStorage from "use-local-storage";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const defaultDark = window.matchMedia(
    "(prefers-colors-scheme: dark)"
  ).matches;

  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <div className="App" data-theme={theme}>
      <Navbar switchTheme={switchTheme} />
      <DashboardLayout />
    </div>
  );
}

export default App;
