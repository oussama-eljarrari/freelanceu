# Orders Integration - Technical Documentation

## Overview

This document explains the orders management system integration that replaced mock-driven order data with a real backend API connected to the frontend through session-based authentication.

---

## Changes Made

### Backend Changes

#### 1. **New Orders Module** (`backend/src/orders/`)

Created a complete NestJS orders module with the following structure:

##### **orders.entity.ts**
- Defines `OrderEntity` class with order properties
- Defines `OrderStatus` type: `'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled'`
- Includes snapshot types for related data:
  - `OrderUserSnapshot`: Client/freelancer info (id, name, avatar, email)
  - `OrderGigSnapshot`: Gig details (id, title, description, thumbnail, deliveryDays)

##### **dto/create-order.dto.ts**
- Validates incoming order creation requests
- Captures gig details, freelancer info, price, and requirements
- Includes optional delivery deadline (auto-calculated from deliveryDays if not provided)

##### **dto/update-order.dto.ts**
- Validates order updates
- Allows partial updates to status, requirements, deadline, and price

##### **orders.service.ts**
- **In-memory storage**: Orders stored in a private array (no database)
- **Key methods**:
  - `findAll()`: Returns all orders
  - `findOne(id)`: Retrieves a single order
  - `findForUser(user)`: Returns orders filtered by user role
    - Admins see all orders
    - Regular users see only their own orders (as client or freelancer)
  - `create(payload, client)`: Creates new order, captures client from session
  - `update(id, payload)`: Updates order status/deadline/price
  - `getStatusCounts(orders)`: Returns aggregated stats (total, completed, inProgress, pending)

##### **orders.controller.ts**
- **POST /orders**: Create order
  - Requires authenticated session
  - Validates all required fields
  - Associates order with logged-in user as client
- **GET /orders**: List user's orders
  - Returns filtered orders + status counts
  - Requires authentication
- **GET /orders/:id**: Retrieve single order
  - Verifies user owns order or is admin
- **PATCH /orders/:id**: Update order
  - Only freelancer or admin can update
  - Validates order status transitions

##### **orders.module.ts**
- Declares OrdersController and OrdersService
- No external dependencies (no database providers)

#### 2. **AppModule Updated** (`backend/src/app.module.ts`)
- Added `OrdersModule` to imports
- Orders endpoints now available at `/api/orders`

---

### Frontend Changes

#### 1. **API Client Extended** (`src/api/client.ts`)
- Added `patch()` method for HTTP PATCH requests
- Used by order status updates

#### 2. **OrdersPage Component** (`src/components/Orders/OrdersPage.tsx`)
- **Before**: Read from `mockOrders` static array
- **After**: Fetches live data on component mount
  - `useEffect` hook triggers `GET /orders` on authentication
  - Loading state displays "Chargement des commandes"
  - Error state shows error message if fetch fails
  - Successfully loaded orders populate page
- **Filtering**: Client-side filtering by status and search term works on live data
- **Stats**: Dynamically calculated from fetched orders

#### 3. **OrderPopup Component** (`src/components/Home-page/OrderPopup.tsx`)
- **Before**: Simulated payment processing with setTimeout
- **After**: Real order creation
  - Uses `api.post('/orders', payload)` to submit order
  - Sends gig details, freelancer info, price, and requirements
  - Session cookie automatically included (credentials: 'include')
  - Success/error handling with user feedback

---

## Architecture & Data Flow

### Session-Based Authentication Flow

```
User Login
   ↓
Browser Session Cookie Set (express-session)
   ↓
All API Requests Include Cookie (credentials: 'include')
   ↓
Backend Session Decorator Accesses session.user
   ↓
Order Operations Linked to Authenticated User
```

**Key Point**: No JWT tokens needed. Express session middleware handles user state on the backend.

---

## Order Lifecycle - Technical Walkthrough

### Step 1: User Views Orders Page

```
Frontend (OrdersPage.tsx)
├─ Component mounts
├─ useEffect checks isAuthenticated
├─ Calls api.get('/orders')
└─ Sets loading state

HTTP Request
└─ GET /api/orders
   ├─ Headers: Cookie: connect.sid=<session-id>
   └─ Body: (empty)

Backend (orders.controller.ts)
├─ @Get() handler receives request
├─ Reads @Session() → session.user
├─ If no user → throws UnauthorizedException
└─ Calls ordersService.findForUser(user)

Backend (orders.service.ts)
├─ findForUser(user) checks user.role
├─ If 'admin': returns ALL orders
├─ Else: filters orders where clientId === user.id OR freelancerId === user.id
└─ Returns filtered array

HTTP Response
└─ 200 OK
   {
     "data": [
       {
         "id": "o1",
         "gigId": "g1",
         "gig": { "title": "...", "thumbnail": "..." },
         "clientId": "u3",
         "client": { "name": "Lina Ouhab", "avatar": "..." },
         "freelancerId": "u1",
         "freelancer": { "name": "Sara Malik", "avatar": "..." },
         "status": "in_progress",
         "price": 50,
         "requirements": "...",
         "createdAt": "2025-04-20T...",
         "deliveryDeadline": "2025-04-23T..."
       }
     ],
     "stats": {
       "total": 1,
       "completed": 0,
       "inProgress": 1,
       "pending": 0
     }
   }

Frontend (OrdersPage.tsx)
├─ Response received
├─ setLoading(false)
├─ setOrders(response.data)
└─ Component re-renders with live orders
```

### Step 2: User Creates New Order

```
Frontend (OrderPopup.tsx)
├─ User clicks gig card
├─ Popup modal opens
├─ User selects payment method
└─ Clicks "Continue" button

handleConfirmOrder() Function
├─ Validates paymentMethod selected
├─ Validates isAuthenticated
├─ Sets isProcessing = true
└─ Calls api.post('/orders', {
     gigId: gig.id,
     gigTitle: gig.title,
     gigDescription: gig.description,
     gigThumbnail: gig.thumbnail,
     deliveryDays: gig.deliveryDays,
     freelancerId: gig.sellerId,
     freelancerName: gig.seller.name,
     freelancerAvatar: gig.seller.avatar,
     price: gig.price,
     requirements: `Payment method: ${paymentMethod}`,
   })

HTTP Request
└─ POST /api/orders
   ├─ Headers: 
   │  ├─ Cookie: connect.sid=<session-id>
   │  └─ Content-Type: application/json
   └─ Body: {
       "gigId": "g1",
       "gigTitle": "I will design a professional logo...",
       "gigDescription": "High quality logo design...",
       "gigThumbnail": "https://picsum.photos/seed/logo/400/300",
       "deliveryDays": 3,
       "freelancerId": "u1",
       "freelancerName": "Sara Malik",
       "freelancerAvatar": "https://i.pravatar.cc/150?img=47",
       "price": 50,
       "requirements": "Payment method: wallet"
     }

Backend (orders.controller.ts)
├─ @Post() create() handler receives request
├─ Reads @Body() payload (CreateOrderDto)
├─ Reads @Session() session.user
├─ If no user → throws UnauthorizedException
├─ Validates all required fields
│  └─ gigId, gigTitle, gigDescription, gigThumbnail,
│     deliveryDays, freelancerId, freelancerName,
│     freelancerAvatar, price, requirements
└─ If validation passes → calls ordersService.create(payload, user)

Backend (orders.service.ts)
├─ create() method
├─ Generates unique order ID: o_<timestamp>_<random>
├─ Captures current timestamp as createdAt
├─ Calculates deliveryDeadline:
│  └─ If provided in payload: use it
│  └─ Else: currentDate + (deliveryDays * 24 hours)
├─ Creates OrderEntity object:
│  ├─ Associates clientId: user.id (from session)
│  ├─ Associates client details from session user
│  ├─ Sets status: 'pending'
│  └─ Stores gig snapshot (title, description, thumbnail, etc.)
├─ Adds order to private orders array (unshift = newest first)
└─ Returns created order

HTTP Response
└─ 201 OK
   {
     "message": "Order created",
     "data": {
       "id": "o_1715425890123_abc123",
       "gigId": "g1",
       "gig": { "title": "...", ... },
       "clientId": "u3",
       "client": { "name": "Lina Ouhab", ... },
       "freelancerId": "u1",
       "freelancer": { "name": "Sara Malik", ... },
       "status": "pending",
       "price": 50,
       "requirements": "Payment method: wallet",
       "createdAt": "2025-05-10T14:31:30.123Z",
       "deliveryDeadline": "2025-05-13T14:31:30.123Z"
     }
   }

Frontend (OrderPopup.tsx)
├─ Response received
├─ setIsProcessing(false)
├─ Shows success alert
├─ Calls onClose()
└─ Popup modal closes
```

### Step 3: Freelancer Views Active Orders (in Dashboard)

```
Frontend (Dashboard.tsx) - Future Implementation
├─ Component mounts
├─ Calls api.get('/orders')
├─ Filters orders where freelancerId === user.id AND status === 'in_progress'
└─ Displays in Active Orders table

Backend
├─ Same GET /orders handler
├─ findForUser() returns orders where user is freelancer
└─ Frontend filters to just in_progress orders
```

---

## Security & Access Control

### Session-Based Protection

1. **Every request requires valid session cookie**
   ```typescript
   // In controller
   const user = session?.user;
   if (!user) {
     throw new UnauthorizedException('You must be signed in...');
   }
   ```

2. **Users can only see their own orders** (unless admin)
   ```typescript
   // In service
   findForUser(user: SessionUser) {
     if (user.role === 'admin') return this.orders; // Admin sees all
     
     // Regular users see only their orders
     return this.orders.filter(
       order => order.clientId === user.id || order.freelancerId === user.id
     );
   }
   ```

3. **Only freelancer can update order status**
   ```typescript
   // In update handler
   if (user.role !== 'admin' && order.freelancerId !== user.id) {
     throw new UnauthorizedException('Only the assigned freelancer can update...');
   }
   ```

---

## Database State (In-Memory)

Currently, orders are stored in a **private array in OrdersService**:

```typescript
private readonly orders: OrderEntity[] = [
  // Pre-seeded with 3 test orders (o1, o2, o3)
  // All assigned to user u3 (Lina Ouhab) as client
  // Freelancers: u1 (Sara Malik), u2 (Karim Benali)
  {
    id: 'o1',
    status: 'in_progress',
    clientId: 'u3',
    freelancerId: 'u1',
    // ... other fields
  },
  // ...
];
```

**Important**: Data persists only during server runtime. Server restart clears all new orders.

---

## Current Implementation Status

### ✅ Completed

| Feature | Status | Location |
|---------|--------|----------|
| Orders Module Created | ✅ | `backend/src/orders/` |
| Session Auth Protected | ✅ | Controller decorators |
| GET /orders (list user orders) | ✅ | OrdersController |
| POST /orders (create order) | ✅ | OrdersController |
| PATCH /orders/:id (update status) | ✅ | OrdersController |
| OrdersPage Reads Live Data | ✅ | `src/components/Orders/OrdersPage.tsx` |
| OrderPopup Creates Real Orders | ✅ | `src/components/Home-page/OrderPopup.tsx` |
| API Client PATCH Support | ✅ | `src/api/client.ts` |

### 🔄 Still Using Mocks

| Feature | Status | Location |
|---------|--------|----------|
| Dashboard Active Orders | 🔄 | `src/components/Dashboard-Page/Dashboard.tsx` |
| Admin Dashboard Order Stats | 🔄 | `src/components/Admin-Page/AdminDashboard.tsx` |

These components still read from `mockOrders` and mock stats. They will be updated in the next phase to use the backend API.

---

## How to Test

### Test Case 1: View Orders Page

1. Start backend: `cd backend && pnpm start:dev`
2. Start frontend: `cd .. && pnpm run dev`
3. Navigate to `/orders` when authenticated
4. **Expected**: Live orders from backend (o1, o2, o3 pre-seeded)
5. **Verify**: Filter by status and search work on live data

### Test Case 2: Create New Order

1. Navigate to home page (`/home`)
2. Find a gig card
3. Click "Peser Une Commande" (Place Order)
4. Select payment method
5. Click "Continue"
6. **Expected**: "Order placed successfully!" alert
7. **Verify**: Order appears in `/orders` page

### Test Case 3: Verify Order Details

1. In `/orders` page, click an order to expand it
2. **Expected**: Shows order details, gig info, freelancer info
3. **Verify**: All data populated correctly

### Test Case 4: Session Protection

1. Log out
2. Try navigating to `/orders`
3. **Expected**: Access denied message

---

## Network Requests Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (Frontend)                       │
│                                                               │
│  OrdersPage.tsx ─────────────────────────────────────────┐  │
│  useEffect() calls:                                       │  │
│  api.get('/orders')                                       │  │
└─────────────────────────────────────────────────────────┬────┘
                                                           │
                              HTTP GET /api/orders          │
                    ┌─────────────────────────────┐         │
                    │ + Cookie: connect.sid=...   │         │
                    └──────────────┬──────────────┘         │
                                   │                         │
                                   ▼                         │
┌────────────────────────────────────────────────────────────┼───┐
│                   BACKEND (NestJS)                         │   │
│                                                             │   │
│  main.ts ─────────► Express Session Middleware             │   │
│                     ├─► Read Cookie                        │   │
│                     └─► Populate session.user              │   │
│                                                             │   │
│  OrdersController.ts                                       │   │
│  ├─ @Get() findAll()                                       │   │
│  ├─ Reads @Session() session.user                          │   │
│  ├─ Calls ordersService.findForUser(user)                  │   │
│  └─ Returns { data, stats }                                │   │
│                                                             │   │
│  OrdersService.ts                                          │   │
│  └─► orders: OrderEntity[] (in-memory storage)             │   │
│                                                             │   │
└────────────────┬───────────────────────────────────────────┘
                 │
                 │ HTTP 200 OK
      ┌──────────┴──────────┐
      │ {                   │
      │   "data": [ ... ],  │
      │   "stats": { ... }  │
      │ }                   │
      └──────────┬──────────┘
                 │
                 ▼
┌────────────────────────────────┐
│ OrdersPage.tsx                 │
│ ├─ setOrders(response.data)    │
│ ├─ setLoading(false)           │
│ └─ Component re-renders        │
└────────────────────────────────┘
```

---

## Code Examples

### Creating an Order (Frontend)

```typescript
// src/components/Home-page/OrderPopup.tsx
const handleConfirmOrder = async () => {
  if (!paymentMethod || !isAuthenticated || !user) return;
  setIsProcessing(true);
  
  try {
    await api.post("/orders", {
      gigId: gig.id,
      gigTitle: gig.title,
      gigDescription: gig.description,
      gigThumbnail: gig.thumbnail,
      deliveryDays: gig.deliveryDays,
      freelancerId: gig.sellerId,
      freelancerName: gig.seller.name,
      freelancerAvatar: gig.seller.avatar,
      price: gig.price,
      requirements: `Payment method: ${paymentMethod}`,
    });
    
    alert("Order placed successfully!");
    onClose();
  } catch (error) {
    alert(error instanceof Error ? error.message : "Failed to place order");
  } finally {
    setIsProcessing(false);
  }
};
```

### Fetching Orders (Frontend)

```typescript
// src/components/Orders/OrdersPage.tsx
useEffect(() => {
  if (!isAuthenticated) return;
  
  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<{ data: Order[]; stats?: unknown }>("/orders");
      setOrders(response.data ?? []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  
  loadOrders();
}, [isAuthenticated]);
```

### Creating an Order (Backend)

```typescript
// backend/src/orders/orders.service.ts
create(payload: CreateOrderDto, client: SessionUser): OrderEntity {
  const createdAt = new Date().toISOString();
  const deliveryDeadline = payload.deliveryDeadline ?? 
    new Date(Date.now() + payload.deliveryDays * 24 * 60 * 60 * 1000).toISOString();
  
  const order: OrderEntity = {
    id: this.createId(),
    gigId: payload.gigId,
    gig: {
      id: payload.gigId,
      title: payload.gigTitle,
      description: payload.gigDescription,
      thumbnail: payload.gigThumbnail,
      deliveryDays: payload.deliveryDays,
    },
    clientId: client.id,  // From session
    client: {
      id: client.id,
      name: client.name,
      avatar: client.avatar,
      email: client.email,
    },
    freelancerId: payload.freelancerId,
    freelancer: {
      id: payload.freelancerId,
      name: payload.freelancerName,
      avatar: payload.freelancerAvatar,
    },
    status: 'pending',
    price: payload.price,
    requirements: payload.requirements,
    createdAt,
    deliveryDeadline,
  };
  
  this.orders.unshift(order);  // Add to top of array
  return order;
}
```

---

## Key Design Decisions

### 1. **In-Memory Storage**
- **Why**: No database setup needed for Phase 1 testing
- **Trade-off**: Data lost on server restart
- **Future**: Replace with TypeORM + PostgreSQL

### 2. **Session-Based Auth**
- **Why**: Aligns with existing auth implementation (express-session)
- **Benefit**: Session cookie automatically sent by browser
- **No Need**: For JWT token management in this phase

### 3. **Snapshot Data in Orders**
- **Why**: Gig info might change after order placed; preserve original gig state
- **Benefit**: Order history shows exactly what was purchased, not current gig state

### 4. **Role-Based Filtering**
- **Why**: Different views for clients vs freelancers vs admins
- **Implementation**: `findForUser(user)` checks `user.role` in service

### 5. **Client-Side Filtering**
- **Why**: Orders page stats and search still computed on frontend
- **Benefit**: Instant feedback without extra API calls
- **Improvement**: Could move to backend for large datasets

---

## Future Enhancements

1. **Database Persistence**
   - Replace in-memory array with TypeORM entities
   - Add PostgreSQL database
   - Implement migrations

2. **Dashboard Integration**
   - Dashboard.tsx → fetch freelancer orders from backend
   - AdminDashboard.tsx → fetch platform-wide stats
   - Real-time updates with WebSocket

3. **Order Status Workflow**
   - Implement PATCH /orders/:id for status transitions
   - Add validation for valid transitions (pending → in_progress → completed)
   - Notify parties when status changes

4. **Order Messaging**
   - Link orders to Messages module
   - Discussion thread per order

5. **Payments**
   - Integrate Stripe/payment processor
   - Record transaction in order

6. **Reviews/Ratings**
   - Create review after order completed
   - Link to Review entity

---

## Files Modified/Created

### Created Files
- `backend/src/orders/entities/order.entity.ts`
- `backend/src/orders/dto/create-order.dto.ts`
- `backend/src/orders/dto/update-order.dto.ts`
- `backend/src/orders/orders.service.ts`
- `backend/src/orders/orders.controller.ts`
- `backend/src/orders/orders.module.ts`

### Modified Files
- `backend/src/app.module.ts` (added OrdersModule import)
- `src/api/client.ts` (added patch method)
- `src/components/Orders/OrdersPage.tsx` (live data fetching)
- `src/components/Home-page/OrderPopup.tsx` (real order creation)

---

## Conclusion

The orders integration successfully replaced mock-driven order management with a real session-protected backend API. The architecture uses in-memory storage for Phase 1 testing and includes role-based access control for secure order operations. The frontend seamlessly integrates with the new endpoints using the existing API client, maintaining the same user experience while operating on live data.

The system is now ready for Phase 2: database persistence and Dashboard/Admin panel integration.
