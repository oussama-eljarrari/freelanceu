import { mockUsers, mockGigs, mockOrders } from "@/mocks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, LayoutList, ShoppingCart, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
     
      <div className="container mx-auto max-w-7xl p-6 space-y-8">
        
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-heading">Admin Overview</h1>
          <p className="text-muted-foreground font-sans">Manage users, moderate gigs, and monitor platform activity.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{mockUsers.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gigs</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <LayoutList className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{mockGigs.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <ShoppingCart className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{mockOrders.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="gigs">Gigs</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* USERS TAB */}
          <TabsContent value="users" className="mt-6">
            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-heading">Registered Users</CardTitle>
                <CardDescription>All active users on the platform.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GIGS TAB */}
          <TabsContent value="gigs" className="mt-6">
            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-heading">Gig Moderation</CardTitle>
                <CardDescription>Review and manage all service listings.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Gig</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockGigs.map((gig) => (
                      <TableRow key={gig.id}>
                        <TableCell className="font-medium line-clamp-1">{gig.title}</TableCell>
                        <TableCell><Badge variant="secondary">{gig.category}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{gig.seller.name}</TableCell>
                        <TableCell className="text-right font-medium">${gig.price}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="mt-6">
            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-heading">Platform Orders</CardTitle>
                <CardDescription>Overview of all transactions.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Gig</TableHead>
                      <TableHead>Client & Seller</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">{order.id.toUpperCase()}</TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">{order.gig.title}</TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="text-muted-foreground">C: {order.client.name}</span>
                            <span className="text-muted-foreground">S: {order.freelancer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{order.status.replace('_', ' ')}</Badge></TableCell>
                        <TableCell className="text-right font-medium">${order.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
