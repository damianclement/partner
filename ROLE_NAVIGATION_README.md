# Role-Based Sidebar Navigation System

## Overview

This implementation provides a comprehensive role-based navigation system that dynamically filters sidebar menu items based on user roles. The system supports two main user types: **Administrator** and **Partner User**.

## Features

### ✅ **Role-Based Access Control**
- **Administrator Role**: Full access to all navigation items
- **Partner Role**: Limited access to specific navigation items only

### ✅ **Dynamic Navigation Filtering**
- Sidebar items are filtered based on user role permissions
- Dropdown submenu items are also filtered by role
- Real-time role switching with page reload

### ✅ **User Context Management**
- Centralized user state management with React Context
- User information display in sidebar profile section
- Role validation and permission checking

## Navigation Access Matrix

| Navigation Item | Admin | Partner | Notes |
|----------------|-------|---------|-------|
| Dashboard | ✅ | ✅ | Both roles can access |
| Partner Management | ✅ | ❌ | Admin only |
| Agent Management | ✅ | ✅ | Both can view agents |
| Group Agent Management | ✅ | ✅ | Both can view group agents |
| Super Agent Management | ✅ | ✅ | Both can view super agents |
| User Management | ✅ | ✅ | Both can access |
| - All Users | ✅ | ✅ | Both can view users |
| - User Roles | ✅ | ❌ | Admin only |
| Bus Systems | ✅ | ❌ | Admin only |
| Booking Management | ✅ | ✅ | Both can view bookings |
| Settings | ✅ | ❌ | Admin only |

## Implementation Details

### 1. **User Context Provider** (`lib/contexts/UserContext.tsx`)
- Manages user state and role information
- Provides role checking utilities (`hasRole`, `hasAnyRole`)
- Simulates user loading with mock data
- Supports role switching for demo purposes

### 2. **Enhanced Sidebar Component** (`components/Sidebar.tsx`)
- Role-based navigation item filtering
- Dynamic dropdown submenu filtering
- User profile display with role information
- Responsive design maintained

### 3. **Navigation Configuration**
- Each navigation item includes `allowedRoles` property
- Dropdown items can have individual role restrictions
- Flexible permission system for future expansion

### 4. **Demo Component** (`components/RoleDemoComponent.tsx`)
- Interactive role switching interface
- Current user information display
- Navigation access overview
- Visual role indicators

## Usage

### Switching User Roles (Demo)
```typescript
import { switchUserRole } from '@/lib/contexts/UserContext';

// Switch to admin role
switchUserRole('admin');

// Switch to partner role
switchUserRole('partner');
```

### Checking User Roles
```typescript
import { useUser } from '@/lib/contexts/UserContext';

function MyComponent() {
  const { user, hasRole, hasAnyRole } = useUser();
  
  // Check specific role
  if (hasRole('admin')) {
    // Admin-only functionality
  }
  
  // Check multiple roles
  if (hasAnyRole(['admin', 'partner'])) {
    // Accessible to both roles
  }
}
```

## Security Considerations

### ✅ **Current Implementation**
- Client-side role filtering for UI/UX
- Navigation items hidden based on role
- User context provides role information

### ⚠️ **Important Notes**
- **This is a demo implementation** - in production, you should:
  - Implement server-side authentication
  - Add API route protection
  - Use JWT tokens or session management
  - Implement proper user database integration
  - Add role-based API endpoint filtering

## Future Enhancements

1. **Server-Side Integration**
   - Real authentication system
   - Database user management
   - JWT token validation

2. **Advanced Permissions**
   - Granular permission system
   - Resource-level access control
   - Dynamic permission loading

3. **Multi-Tenant Support**
   - Organization-based access
   - Partner-specific data filtering
   - Hierarchical role system

## Files Modified/Created

- ✅ `lib/contexts/UserContext.tsx` - User context provider
- ✅ `components/Sidebar.tsx` - Enhanced with role filtering
- ✅ `components/DashboardLayout.tsx` - Added UserProvider wrapper
- ✅ `components/RoleDemoComponent.tsx` - Demo interface
- ✅ `app/(root)/page.tsx` - Added demo component

## Testing the System

1. **Start the development server**: `npm run dev`
2. **Navigate to the dashboard** - You'll see the role demo component
3. **Switch between roles** using the demo buttons
4. **Observe sidebar changes** - Navigation items will appear/disappear based on role
5. **Test navigation** - Try accessing restricted pages to see role-based behavior

The system is now fully functional and ready for integration with a real authentication system!
