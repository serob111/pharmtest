
import AuthProvider from "./context/AuthProvider";
import { Routes } from "./routes/routes";

function App() {
  return (
    <AuthProvider>
        <Routes />
    </AuthProvider>
  );
}

export default App;