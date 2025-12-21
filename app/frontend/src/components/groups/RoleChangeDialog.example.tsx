/**
 * Example usage of RoleChangeDialog component
 * 
 * This file demonstrates how to integrate the RoleChangeDialog into your application.
 * It can be used for development testing and as a reference for implementation.
 */

import React, { useState } from 'react';
import RoleChangeDialog from './RoleChangeDialog';
import { GroupMember, GroupRole } from '../../types/GroupMember';

/**
 * Example: Role Change Dialog Usage
 * 
 * This component shows how to use the RoleChangeDialog in a real scenario,
 * typically within a member list or member management page.
 */
function RoleChangeDialogExample() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);

  // Example mock members
  const mockMembers: GroupMember[] = [
    {
      id: 'member-1',
      groupId: 'group-1',
      userId: 'user-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: GroupRole.OWNER,
      avatar: 'https://i.pravatar.cc/150?u=john',
      joinedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'member-2',
      groupId: 'group-1',
      userId: 'user-2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: GroupRole.ADMIN,
      avatar: 'https://i.pravatar.cc/150?u=jane',
      joinedAt: '2024-01-16T09:30:00Z',
    },
    {
      id: 'member-3',
      groupId: 'group-1',
      userId: 'user-3',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: GroupRole.MEMBER,
      joinedAt: '2024-01-17T11:15:00Z',
    },
  ];

  const handleChangeRole = (member: GroupMember) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMember(null);
  };

  const handleSuccess = () => {
    console.log('Role changed successfully!');
    // Optionally refresh member list here
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Role Change Dialog Example</h2>
      <p>Click "Change Role" on any member to open the dialog.</p>

      <div style={{ marginTop: '20px' }}>
        <h3>Group Members</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockMembers.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#4285f4',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                    )}
                    {member.name}
                  </div>
                </td>
                <td style={{ padding: '12px', color: '#666' }}>{member.email}</td>
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      backgroundColor:
                        member.role === GroupRole.OWNER
                          ? '#fef3c7'
                          : member.role === GroupRole.ADMIN
                            ? '#dbeafe'
                            : member.role === GroupRole.MEMBER
                              ? '#d1fae5'
                              : '#e5e7eb',
                      color:
                        member.role === GroupRole.OWNER
                          ? '#92400e'
                          : member.role === GroupRole.ADMIN
                            ? '#1e40af'
                            : member.role === GroupRole.MEMBER
                              ? '#065f46'
                              : '#374151',
                    }}
                  >
                    {member.role}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => handleChangeRole(member)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#4285f4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Change Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Change Dialog */}
      <RoleChangeDialog
        isOpen={isDialogOpen}
        member={selectedMember}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default RoleChangeDialogExample;
