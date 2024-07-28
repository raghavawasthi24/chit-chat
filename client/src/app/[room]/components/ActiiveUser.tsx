import React from "react";

interface ActiveUserProps {
  activeUsers: { username: string; userId: string }[];
}

const ActiveUser: React.FC<ActiveUserProps> = ({ activeUsers }) => {
  return (
    <div>
      <h2 className="text-xl font-bold">Active Users</h2>
      <ul>
        {activeUsers.map((user) => (
          <li key={user.userId} className="p-2 border-b">
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUser;
