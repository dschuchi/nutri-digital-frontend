import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserChat } from '../components/professionals/UserChat';
import { ProfessionalChat } from '../components/professionals/ProfessionalChat';

export function ChatPage() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const targetId = searchParams.get('target');

    return (
        <div>
            {user.professional
                ? <ProfessionalChat forcedTargetId={targetId ? parseInt(targetId) : null} />
                : <UserChat />}
        </div>
    );
}
