import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Order } from "@/types";
import { mockOrders } from "@/mocks";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  DollarSign, 
  User,
  ChevronDown,
  Filter,
  Search
} from "lucide-react";

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Accès Refusé</h2>
        <p className="text-muted-foreground mt-2">Veuillez vous connecter pour afficher vos commandes.</p>
      </div>
    );
  }

  // Filtrage des commandes où l'utilisateur connecté est le client
  let userOrders: Order[] = mockOrders.filter(
    (order: Order) => order.clientId === user?.id
  );

  // Application des filtres
  if (filterStatus !== "all") {
    userOrders = userOrders.filter(order => order.status.toLowerCase() === filterStatus);
  }

  if (searchTerm) {
    userOrders = userOrders.filter(order => 
      order.gig?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.freelancer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Statistiques
  const stats = {
    total: mockOrders.filter((o: Order) => o.clientId === user?.id).length,
    completed: mockOrders.filter((o: Order) => o.clientId === user?.id && (o.status.toLowerCase() === "completed" || o.status.toLowerCase() === "delivered")).length,
    inProgress: mockOrders.filter((o: Order) => o.clientId === user?.id && o.status.toLowerCase() === "in_progress").length,
    pending: mockOrders.filter((o: Order) => o.clientId === user?.id && o.status.toLowerCase() === "pending").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "delivered":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "pending":
        return <Calendar className="w-5 h-5 text-amber-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Terminé";
      case "delivered":
        return "Livré";
      case "in_progress":
        return "En cours";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulé";
      default:
        return status.replace("_", " ");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "delivered":
        return "bg-green-50 border-green-200";
      case "in_progress":
        return "bg-blue-50 border-blue-200";
      case "pending":
        return "bg-amber-50 border-amber-200";
      case "cancelled":
        return "bg-red-50 border-red-200";
      default:
        return "bg-background border-border";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto py-12 px-4 md:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Suivi de vos achats</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Mes Commandes</h1>
          <p className="text-lg text-muted-foreground">
            Suivez et gérez tous les services que vous avez achetés.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border border-border/60 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-foreground">{stats.total}</div>
              <p className="text-sm text-muted-foreground mt-1">Total commandes</p>
            </CardContent>
          </Card>
          <Card className="border border-border/60 hover:shadow-md transition-shadow bg-blue-50/50 border-blue-200/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-sm text-blue-600/70 mt-1">En cours</p>
            </CardContent>
          </Card>
          <Card className="border border-border/60 hover:shadow-md transition-shadow bg-green-50/50 border-green-200/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-sm text-green-600/70 mt-1">Complétées</p>
            </CardContent>
          </Card>
          <Card className="border border-border/60 hover:shadow-md transition-shadow bg-amber-50/50 border-amber-200/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
              <p className="text-sm text-amber-600/70 mt-1">En attente</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filtres */}
          <div className="lg:col-span-1">
            <Card className="border border-border/60 sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="w-4 h-4" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Statut</label>
                  <div className="space-y-2">
                    {[
                      { label: "Tous", value: "all" },
                      { label: "En attente", value: "pending" },
                      { label: "En cours", value: "in_progress" },
                      { label: "Livré", value: "delivered" },
                      { label: "Complétées", value: "completed" },
                      { label: "Annulées", value: "cancelled" },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setFilterStatus(option.value)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          filterStatus === option.value
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par service ou freelance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
              />
            </div>

            {/* Orders List */}
            {userOrders.length === 0 ? (
              <Card className="border border-border/60 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucune commande trouvée</h3>
                  <p className="text-muted-foreground text-center max-w-sm">
                    {searchTerm || filterStatus !== "all" 
                      ? "Essayez d'ajuster vos filtres ou votre recherche."
                      : "Vous n'avez passé aucune commande pour le moment. Découvrez nos services !"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <Card 
                    key={order.id} 
                    className={`border transition-all hover:shadow-md cursor-pointer ${getStatusColor(order.status)}`}
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    {/* Order Header */}
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left Content */}
                        <div className="flex gap-4 flex-1">
                          {/* Thumbnail */}
                          <div className="hidden sm:block h-16 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={order.gig?.thumbnail || "https://picsum.photos/seed/order/100/100"}
                              alt={order.gig?.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground truncate">
                                {order.gig?.title || "Service indisponible"}
                              </h3>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                #{order.id}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 text-sm">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <User className="w-3.5 h-3.5" />
                                <span className="truncate">{order.freelancer?.name || "Freelance inconnu"}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(order.createdAt).toLocaleDateString("fr-FR", { month: "short", day: "numeric" })}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span className="font-semibold text-foreground">{order.price}$</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge className={`${
                              order.status.toLowerCase() === "completed" || order.status.toLowerCase() === "delivered"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : order.status.toLowerCase() === "in_progress"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : order.status.toLowerCase() === "pending"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          <ChevronDown 
                            className={`w-4 h-4 text-muted-foreground transition-transform ${
                              expandedOrder === order.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedOrder === order.id && (
                        <div className="mt-6 pt-6 border-t border-border/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Date de livraison prévue</p>
                              <p className="text-sm font-medium text-foreground">
                                {order.deliveryDeadline 
                                  ? new Date(order.deliveryDeadline).toLocaleDateString("fr-FR", { 
                                      year: "numeric", 
                                      month: "long", 
                                      day: "numeric" 
                                    })
                                  : "Non défini"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Prix total</p>
                              <p className="text-sm font-bold text-primary">{order.price} $</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">À propos du service</p>
                            <p className="text-sm text-foreground leading-relaxed">
                              {order.gig?.description || "Description non disponible"}
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button size="sm" className="flex-1">
                              Contacter le freelance
                            </Button>
                            {(order.status.toLowerCase() === "completed" || order.status.toLowerCase() === "delivered") && (
                              <Button size="sm" variant="outline" className="flex-1">
                                Laisser un avis
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}