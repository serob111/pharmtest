
import AuthProvider from "./context/AuthProvider";
import { GlobalLoadingProvider } from "./context/GlobalLoadingProvider";
import GlobalSpinner from "./components/shared/ui/GlobalSpinner";
import { Routes } from "./routes/routes";

function App() {
  return (
    <GlobalLoadingProvider>
      <AuthProvider>
        <GlobalSpinner />
        <Routes />
      </AuthProvider>
    </GlobalLoadingProvider>
  );
}

export default App;