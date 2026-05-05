import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Order } from "@/types";
import { mockOrders } from "@/mocks";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Accès Refusé</h2>
        <p className="text-muted-foreground mt-2">Veuillez vous connecter pour afficher vos commandes.</p>
      </div>
    );
  }

  // Filtrage des commandes où l'utilisateur connecté est le client
  const userOrders: Order[] = mockOrders.filter(
    (order: Order) => order.clientId === user?.id
  );

  // Mise à jour pour gérer le format snake_case comme "in_progress"
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Terminé</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">En cours</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">En attente</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        // Transforme un statut inconnu "un_statut" en "un statut"
        return <Badge variant="outline" className="capitalize">{status.replace("_", " ")}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mes Commandes</h1>
        <p className="text-muted-foreground mt-1">
          Suivez et gérez les services que vous avez achetés.
        </p>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle>Historique des transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {userOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Vous n'avez passé aucune commande pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Service (Gig)</TableHead>
                    <TableHead>Freelance</TableHead>
                    <TableHead>Acheté le</TableHead>
                    <TableHead>Livraison prévue</TableHead>
                    <TableHead className="text-right">Prix</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOrders.map((order) => (
                    <TableRow key={order.id} className="transition-colors">
                      <TableCell className="font-medium text-muted-foreground">
                        #{order.id}
                      </TableCell>
                      {/* Utilisation de l'objet gig imbriqué avec fallback */}
                      <TableCell className="font-medium">
                        {order.gig?.title || "Service indisponible"}
                      </TableCell>
                      {/* Utilisation de l'objet freelancer imbriqué avec fallback */}
                      <TableCell>
                        {order.freelancer?.name || "Freelance inconnu"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.deliveryDeadline 
                          ? new Date(order.deliveryDeadline).toLocaleDateString() 
                          : "Non défini"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {order.price} $
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(order.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}