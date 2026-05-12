import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, DollarSign, Clock, Tag, AlignLeft, Sparkles } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  // Parser les tags pour preview
  const tagsArray = tagsInput
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  // Form validation check
  const isFormValid = 
    title.trim().length >= 40 && 
    title.length <= 80 &&
    description.trim().length > 0 &&
    category &&
    price &&
    Number(price) >= 5 &&
    deliveryDays &&
    Number(deliveryDays) >= 1;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Accès Refusé</h2>
        <p className="text-muted-foreground mt-2">Veuillez vous connecter pour créer un Gig.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }

    if (title.length < 40) {
      setError(`Le titre doit contenir au moins 40 caractères (actuellement: ${title.length})`);
      return;
    }

    if (title.length > 80) {
      setError(`Le titre ne doit pas dépasser 80 caractères (actuellement: ${title.length})`);
      return;
    }

    if (!description.trim()) {
      setError("La description est requise");
      return;
    }

    if (!category) {
      setError("La catégorie est requise");
      return;
    }

    if (!price) {
      setError("Le prix est requis");
      return;
    }

    if (Number(price) < 5) {
      setError("Le prix doit être d'au moins $5");
      return;
    }

    if (!deliveryDays) {
      setError("Le délai de livraison est requis");
      return;
    }

    if (Number(deliveryDays) < 1) {
      setError("Le délai de livraison doit être au moins 1 jour");
      return;
    }

    setIsSubmitting(true);

    try {
      // Préparer les données à envoyer au backend
      const gigData = {
        title,
        description,
        category,
        price: Number(price),
        deliveryDays: Number(deliveryDays),
        thumbnail: thumbnail || "https://picsum.photos/seed/default/400/300",
        tags: tagsArray,
      };

      // Envoyer au backend
      const response = await api.post<{ message: string; data: any }>('/gigs', gigData);

      if (response && response.data) {
        console.log("Gig créé avec succès :", response.data);
        alert("Gig créé avec succès !");
        navigate("/home");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Erreur lors de la création du gig";
      setError(errorMessage);
      console.error("Erreur création gig:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Monétisez vos talents</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Créer un nouveau Gig</h1>
          <p className="text-lg text-muted-foreground">
            Proposez vos services, définissez vos conditions et attirez de nouveaux clients.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-900">{error}</p>
              </div>
            )}
            
            {/* Section 1: Service Basics */}
            <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-4 h-4 text-primary" />
                  Titre de votre service
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <input
                    id="title"
                    type="text"
                    required
                    placeholder="Ex: I will design a professional logo for your brand"
                    className={`flex h-11 w-full rounded-lg border px-4 py-2 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent transition-all ${
                      title.length >= 40 && title.length <= 80
                        ? 'border-input bg-background focus-visible:ring-primary'
                        : title.length > 0
                        ? 'border-red-300 bg-red-50 focus-visible:ring-red-400'
                        : 'border-input bg-background focus-visible:ring-primary'
                    }`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div className="flex justify-between text-xs">
                    <p className="text-muted-foreground">Minimum 40 caractères - maximum 80 caractères</p>
                    <p className={title.length >= 40 && title.length <= 80 ? 'text-green-600 font-medium' : title.length > 0 && (title.length < 40 || title.length > 80) ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                      {title.length}/80
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Category & Thumbnail */}
            <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Image className="w-4 h-4 text-primary" />
                  Catégorie et Visuel
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Category */}
                  <div className="space-y-3">
                    <label htmlFor="category" className="text-sm font-semibold">Catégorie</label>
                    <select
                      id="category"
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Translation">Translation</option>
                      <option value="Development">Development</option>
                      <option value="Writing">Writing</option>
                      <option value="Tutoring">Tutoring</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="Photo Editing">Photo Editing</option>
                      <option value="Audio & Voice">Audio & Voice</option>
                    </select>
                  </div>

                  {/* Thumbnail */}
                  <div className="space-y-3">
                    <label htmlFor="thumbnail" className="text-sm font-semibold">Lien de l'image (Thumbnail URL)</label>
                    <input
                      id="thumbnail"
                      type="url"
                      placeholder="Ex: https://monsite.com/image.jpg"
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Pricing & Timeline */}
            <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Prix et Délai
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Price */}
                  <div className="space-y-3">
                    <label htmlFor="price" className="text-sm font-semibold">Prix ($)</label>
                    <div className="relative">
                      <input
                        id="price"
                        type="number"
                        min="5"
                        required
                        placeholder="50"
                        className={`flex h-11 w-full rounded-lg border px-4 py-2 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent transition-all ${
                          price && Number(price) >= 5
                            ? 'border-input bg-background focus-visible:ring-primary'
                            : price && Number(price) < 5
                            ? 'border-red-300 bg-red-50 focus-visible:ring-red-400'
                            : 'border-input bg-background focus-visible:ring-primary'
                        }`}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    {price && Number(price) < 5 && (
                      <p className="text-xs text-red-600 font-medium">Le prix minimum est $5</p>
                    )}
                  </div>

                  {/* Delivery Days */}
                  <div className="space-y-3">
                    <label htmlFor="deliveryDays" className="text-sm font-semibold">Délai de livraison (Jours)</label>
                    <div className="flex items-center gap-2">
                      <input
                        id="deliveryDays"
                        type="number"
                        min="1"
                        required
                        placeholder="3"
                        className={`flex h-11 w-full rounded-lg border px-4 py-2 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent transition-all ${
                          deliveryDays && Number(deliveryDays) >= 1
                            ? 'border-input bg-background focus-visible:ring-primary'
                            : deliveryDays && Number(deliveryDays) < 1
                            ? 'border-red-300 bg-red-50 focus-visible:ring-red-400'
                            : 'border-input bg-background focus-visible:ring-primary'
                        }`}
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(e.target.value)}
                      />
                      <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                    {deliveryDays && Number(deliveryDays) < 1 && (
                      <p className="text-xs text-red-600 font-medium">Minimum 1 jour</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Tags */}
            <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="w-4 h-4 text-primary" />
                  Tags (Mots-clés)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <input
                    id="tags"
                    type="text"
                    placeholder="Ex: logo, branding, design"
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                  {tagsArray.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {tagsArray.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary border border-primary/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Maximum 5 tags recommandés</p>
                </div>
              </CardContent>
            </Card>

            {/* Section 5: Description */}
            <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlignLeft className="w-4 h-4 text-primary" />
                  Description détaillée
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <textarea
                    id="description"
                    required
                    rows={6}
                    placeholder="High quality design with unlimited revisions..."
                    className="flex min-h-[150px] w-full rounded-lg border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Décrivez vos services en détail</span>
                    <span>{description.length} caractères</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Preview Card */}
              <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-md overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Aperçu de votre Gig</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Thumbnail Preview */}
                  <div className="relative h-40 w-full rounded-lg overflow-hidden bg-muted border border-border/50">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://picsum.photos/seed/default/300/200";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-12 h-12 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Title Preview */}
                  {title && (
                    <div>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">{title}</p>
                    </div>
                  )}

                  {/* Category Badge */}
                  {category && (
                    <div>
                      <span className="inline-block rounded-full bg-muted px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {category}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  {price && (
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-xs font-medium text-muted-foreground">Prix</span>
                      <span className="text-lg font-bold text-primary">${price}</span>
                    </div>
                  )}

                  {/* Delivery */}
                  {deliveryDays && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Livraison</span>
                      <span className="text-sm font-semibold text-foreground">{deliveryDays}j</span>
                    </div>
                  )}

                  {/* Tags Preview */}
                  {tagsArray.length > 0 && (
                    <div className="pt-2 border-t border-border/50">
                      <div className="flex flex-wrap gap-1.5">
                        {tagsArray.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="inline-block rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                            {tag}
                          </span>
                        ))}
                        {tagsArray.length > 3 && (
                          <span className="inline-block rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            +{tagsArray.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                size="lg"
                className="w-full h-12 rounded-lg font-semibold text-base"
              >
                {isSubmitting ? "Création en cours..." : !isFormValid ? "Complétez tous les champs" : "Publier le Gig"}
              </Button>

              {/* Info Box */}
              <Card className="border border-border/40 bg-background/50">
                <CardContent className="pt-4">
                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-foreground">💡 Conseils</p>
                    <ul className="space-y-1.5 text-muted-foreground">
                      <li>• Soyez précis et détaillé</li>
                      <li>• Utilisez des tags pertinents</li>
                      <li>• Mettez un prix compétitif</li>
                      <li>• Ajoutez une image attractive</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}