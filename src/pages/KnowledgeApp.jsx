import LoginComponent from '../features/auth/components/LoginComponent';
import HomeComponent from '../features/HomeComponent';
import KnowledgeDashboardPage from './dashboardPage/KnowledgeDashboardPage';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import  AuthProvider  from '../features/auth/security/AuthContext';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import OAuth2SuccessPage from '../features/auth/security/OAuth2SuccessPage';
import "../styles/theme.css";
import "../styles/global.css";


export default function KnowledgeApp() {

    return (
        <div className="knowledge-components">
                <BrowserRouter>
                    <AuthProvider>
                        <Routes>
                            <Route path="/" element={<HomeComponent />} />
                            <Route path="/login" element={<LoginComponent />} />
                            <Route path="/oauth2/success" element={<OAuth2SuccessPage />} />
                            <Route path="/profile" element={ <ProtectedRoute> <KnowledgeDashboardPage /> </ProtectedRoute>}  />
                        </Routes>
                    </AuthProvider>
                </BrowserRouter>
        </div>
    );
}

