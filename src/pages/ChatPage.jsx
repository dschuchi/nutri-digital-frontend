import { useAuth } from '../context/AuthContext';
import { UserChat } from '../components/professionals/UserChat';
import { ProfessionalChat } from '../components/professionals/ProfessionalChat';

export function ChatPage() {
    const { user } = useAuth();

    if (!user) return <p>Cargando...</p>;

    return (
        <div>
            {user.professional ? <ProfessionalChat /> : <UserChat />}
        </div>
    );
}
