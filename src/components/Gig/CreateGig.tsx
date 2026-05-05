import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateGigPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // États locaux mis à jour pour correspondre exactement au mock Gig
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Graphic Design");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Accès Refusé</h2>
        <p className="text-muted-foreground mt-2">Veuillez vous connecter pour créer un Gig.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Transformation des tags (séparés par des virgules en tableau de strings)
      const tagsArray = tagsInput
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Création de l'objet qui correspond PARFAITEMENT à l'interface Gig
      const newGigData = {
        // En conditions réelles, l'ID, la date et les stats sont générés par le backend
        id: `g_${Math.random().toString(36).substr(2, 9)}`,
        sellerId: user?.id,
        // On ne passe généralement pas l'objet 'seller' entier à la création, le backend le fera
        title,
        description,
        category,
        price: Number(price),
        deliveryDays: Number(deliveryDays),
        rating: 0,
        totalReviews: 0,
        thumbnail: thumbnail || "https://picsum.photos/seed/default/400/300",
        tags: tagsArray,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      console.log("Nouveau Gig prêt à être envoyé à l'API :", newGigData);
      
      alert("Gig créé avec succès ! (Simulation)");
      setIsSubmitting(false);
      navigate("/home"); 
    }, 1000);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Créer un nouveau Gig</h1>
        <p className="text-muted-foreground mt-1">
          Proposez vos services, définissez vos conditions et attirez de nouveaux clients.
        </p>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle>Détails de votre service</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Titre */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Titre du Gig</label>
              <input
                id="title"
                type="text"
                required
                placeholder="Ex: I will design a professional logo for your brand"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Catégorie et Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Catégorie</label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Writing & Translation">Writing & Translation</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="thumbnail" className="text-sm font-medium">Lien de l'image (Thumbnail URL)</label>
                <input
                  id="thumbnail"
                  type="url"
                  placeholder="Ex: https://monsite.com/image.jpg"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                />
              </div>
            </div>

            {/* Prix et Délai */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">Prix ($)</label>
                <input
                  id="price"
                  type="number"
                  min="5"
                  required
                  placeholder="Ex: 50"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="deliveryDays" className="text-sm font-medium">Délai de livraison (Jours)</label>
                <input
                  id="deliveryDays"
                  type="number"
                  min="1"
                  required
                  placeholder="Ex: 3"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">Tags (séparés par des virgules)</label>
              <input
                id="tags"
                type="text"
                placeholder="Ex: logo, branding, design"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description détaillée</label>
              <textarea
                id="description"
                required
                rows={5}
                placeholder="High quality design with unlimited revisions..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="pt-4 flex justify-end border-t border-gray-100">
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? "Création en cours..." : "Publier le Gig"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}