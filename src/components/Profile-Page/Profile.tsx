import { mockGigs, mockReviews } from "@/mocks"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Calendar, Briefcase, Edit, Share2 } from "lucide-react"
import { Navbar } from "@/components/Landing-Page/Navbar"
import { useAuth } from "@/Context/AuthContext"

export function ProfilePage() {
  const { user } = useAuth()
  const userGigs = mockGigs.filter(g => g.sellerId === user?.id)
  const userReviews = mockReviews.filter(r => r.authorId === user?.id || mockGigs.find(g => g.id === r.gigId)?.sellerId === user?.id) // simplistic assumption for mock

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto max-w-5xl p-6 space-y-8">

        {/* Profile Header */}
        <div className="relative">
          <Card className="shadow-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative">
                <Avatar className="w-32 h-32 border-4 border-background shadow-md">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold font-heading">{user?.name}</h1>
                      <p className="text-base text-muted-foreground mt-1 max-w-xl">{user?.bio}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-end">
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                      <Briefcase className="w-4 h-4" />
                      <span className="capitalize">{user?.role}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                      <Calendar className="w-4 h-4" />
                      {/* <span>Joined {new Date(user!.joinedAt).getFullYear()}</span> */}
                    </div>
                    <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-foreground">{user?.rating}</span>
                      <span>({user?.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="gigs" className="w-full">
          <TabsList className="grid w-full  grid-cols-2">
            <TabsTrigger value="gigs">Active Gigs ({userGigs.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({userReviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="gigs" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userGigs.map((gig) => (
                <Card key={gig.id} className="overflow-hidden hover:shadow-md transition-all group flex flex-col">
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img
                      src={gig.thumbnail}
                      alt={gig.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2 bg-background/80 text-foreground hover:bg-background/90 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                      {gig.rating} ({gig.totalReviews})
                    </Badge>
                  </div>
                  <CardHeader className="p-4 pb-2 flex-1">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs font-normal">{gig.category}</Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                      {gig.title}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                    <div className="flex items-center justify-between w-full mt-2">
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Starting at</p>
                      <p className="text-xl font-bold text-primary">${gig.price}</p>
                    </div>
                    <Button variant="outline" className="w-full">View Gig</Button>
                  </CardFooter>
                </Card>
              ))}
              {userGigs.length === 0 && (
                <div className="col-span-full p-12 text-center border-2 border-dashed rounded-xl">
                  <p className="text-muted-foreground">No active gigs listed.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-4">
            {userReviews.map((review) => (
              <Card key={review.id} className="shadow-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-3 md:items-start md:w-1/4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={review.author.avatar} alt={review.author.name} />
                        <AvatarFallback>{review.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-sm">{review.author.name}</h4>
                        <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted stroke-muted-foreground'}`}
                          />
                        ))}
                        <span className="ml-2 font-medium text-sm">{review.rating}.0</span>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed">{review.comment}</p>
                      <div className="pt-3 border-t flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Purchased:</span>
                        <span className="text-xs font-medium bg-secondary/50 px-2 py-0.5 rounded-sm line-clamp-1">
                          {mockGigs.find(g => g.id === review.gigId)?.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {userReviews.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground">No reviews yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
