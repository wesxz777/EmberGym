import { useEffect, useState } from 'react';

// Define the data structure based on the JSON output
interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
}

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Target the active Laravel local server endpoint
                const response = await fetch('/api/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('API Connection Failed:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">EmberGym User Database</h2>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li key={user.user_id} className="border p-2 rounded">
                        <strong>{user.first_name} {user.last_name}</strong> - {user.email} 
                        <span className="ml-2 text-sm text-gray-500">({user.user_type})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}