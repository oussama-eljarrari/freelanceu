import React from "react";
// On importe le type Review existant
import { Review } from "@/types"; 
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Fonction utilitaire pour afficher les étoiles
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    }
    return stars;
  };

  // Récupérer le nom de l'auteur (avec une sécurité au cas où)
  const authorName = review.author?.name || "Utilisateur Anonyme";
  // l'objet user a une propriété avatar
  const authorImage = review.author?.avatar || "";

  // Récupérer les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="w-full mb-4 shadow-sm border-gray-100 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={authorImage} alt={authorName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(authorName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-semibold">{authorName}</h4>
              <div className="flex items-center mt-1">
                {renderStars(review.rating)}
                <span className="ml-2 text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700 leading-relaxed">
          {review.comment}
        </p>
      </CardContent>
    </Card>
  );
}