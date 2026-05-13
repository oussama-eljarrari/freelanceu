import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { DollarSign, ClipboardList, CheckCircle, Star, ArrowRight, MoreHorizontal, Clock, CheckCircle2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from "react-router"
import { useAuth } from "@/Context/AuthContext"
import { api } from "@/api/client"
import type { Order } from "@/types"
import { useState, useEffect } from "react"

export function DashboardPage() {

  const navigate = useNavigate()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get<{ data: Order[] }>("/orders?include=gig,client")
        setOrders(res.data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const freelancerOrders = orders.filter(o => o.freelancerId === user?.id)
  const completedOrders = freelancerOrders.filter(o => o.status === "completed")
  const activeOrders = freelancerOrders.filter(o => o.status === "in_progress")

  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.price, 0)
  const stats = {
    totalEarnings,
    activeOrders: activeOrders.length,
    completedOrders: completedOrders.length,
    averageRating: user?.rating ?? 0,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">In Progress</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">Completed</Badge>
      case 'delivered':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300">Delivered</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status.replace('_', ' ')}</Badge>
    }
  }

  const calculateProgress = (start: string, end: string) => {
    // Calculate generic progress based on mock dates
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const now = Date.now();
    const total = endDate - startDate;
    const elapsed = now - startDate;
    const percentage = Math.max(0, Math.min(100, (elapsed / total) * 100));
    return percentage;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
     
      <div className="container mx-auto max-w-7xl p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold tracking-tight font-heading">Dashboard</h1>
            <p className="text-muted-foreground font-sans">Welcome back, {user?.name}! Here's what's happening with your business.</p>
          </div>
          <Button onClick={() => navigate("/profile")}>View Public Profile <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">${stats.totalEarnings}</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <ClipboardList className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{stats.activeOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">{activeOrders.length} requiring attention</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{stats.completedOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">{completedOrders.length + activeOrders.length + freelancerOrders.filter(o => o.status === "pending" || o.status === "delivered").length} total lifetime orders</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <Star className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground mt-1">Based on {user?.totalReviews} reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card className="col-span-2 shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
              <div>
                <CardTitle className="font-heading">Active Orders</CardTitle>
                <CardDescription className="mt-1">Manage your ongoing gigs and deliveries.</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[300px]">Gig</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/50 cursor-pointer">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={order.gig.thumbnail} alt="" className="w-10 h-10 rounded object-cover shadow-sm" />
                          <div className="font-medium line-clamp-1">{order.gig.title}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={order.client.avatar} />
                            <AvatarFallback>{order.client.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{order.client.name.split(' ')[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(order.deliveryDeadline).toLocaleDateString()}
                          </div>
                          <Progress value={calculateProgress(order.createdAt, order.deliveryDeadline)} className="h-1.5 w-20" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">${order.price}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {activeOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        No active orders at the moment.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="col-span-1 shadow-sm border-border/50 flex flex-col">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="font-heading">Recent Earnings</CardTitle>
              <CardDescription className="mt-1">Your latest completed work.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <div className="divide-y">
                {completedOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="space-y-1 pr-4">
                        <p className="text-sm font-medium leading-none line-clamp-1">{order.gig.title}</p>
                        <p className="text-xs text-muted-foreground">From {order.client.name}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-green-600 dark:text-green-400">+${order.price}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {completedOrders.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No recent earnings to display.
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button variant="ghost" className="w-full text-primary">View Full History</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
