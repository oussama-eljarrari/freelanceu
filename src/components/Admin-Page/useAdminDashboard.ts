import { api } from "@/api/client";
import { Gig, Order, User } from "@/types";
import { useEffect, useState } from "react";

export const useAdminDashboard = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const users = await api.get<User[]>('/users')

                console.log("Fetched users from backend:", users)
                setUsers(users)
            } catch (err) {
                console.error("Error fetching users:", err)
            }
        }

        const getGigs = async () => {
            try {
                const { data: gigs } = await api.get<{ data: Gig[] }>('/gigs?include=seller')
                console.log("Fetched gigs from backend:", gigs)
                setGigs(gigs)
            } catch (err) {
                console.error("Error fetching gigs:", err)
            }
        }

        const getOrders = async () => {
            try {
                const { data: orders } = await api.get<{ data: Order[] }>('/orders?include=gig,client,freelancer')
                console.log("Fetched orders from backend:", orders)
                setOrders(orders)
                console.log(orders.length)
            } catch (err) {
                console.error("Error fetching orders:", err)
            }
        }

        getUsers()
        getGigs()
        getOrders()

    }, [])


    return { users, gigs, orders }
}