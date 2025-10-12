import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              About Tune Detective 2
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The spiritual successor to the beloved music discovery app
            </p>
          </div>

          {/* Main Content Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>The Story</span>
                <Badge variant="secondary">v2.1</Badge>
              </CardTitle>
              <CardDescription>
                How Tune Detective came to be reborn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Origin Story */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">The Beginning</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This project is the spiritual successor to{" "}
                  <span className="font-medium text-foreground">
                    Tune Detective
                  </span>
                  , created by the talented{" "}
                  <span className="font-medium text-foreground">
                    n00tavailable
                  </span>
                  . The original app used the Deezer API to fetch the latest
                  releases from artists, filling a crucial gap for music lovers
                  who don't rely on traditional streaming platforms like
                  Spotify, Apple Music, Deezer, or [insert music streaming
                  service of choice here].
                </p>
              </div>

              <Separator />

              {/* The Problem */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">The Problem</h3>
                <p className="text-muted-foreground leading-relaxed">
                  For those of us who don't use mainstream music streaming
                  services, discovering new releases from our favourite artists
                  can be a real challenge. Tune Detective was the perfect
                  solution — it kept us in the loop without requiring
                  subscriptions to multiple platforms.
                </p>
              </div>

              <Separator />

              {/* The Disappearance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  When Everything Changed
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  But when the world needed him most, GitHub user N00tavailable
                  vanished. A few months passed, and then the Tune Detective app
                  randomly stopped working. Two weeks ago, my father and the men
                  of my tribe...
                </p>
                <p className="text-muted-foreground leading-relaxed italic">
                  Alright, cut the cringe Avatar references! 😅
                </p>
              </div>

              <Separator />

              {/* The Revival */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">The Revival</h3>
                <p className="text-muted-foreground leading-relaxed">
                  I decided to take on the task of recreating the app myself,
                  but this time as a modern web application. This version is
                  built as a Progressive Web App (PWA), which means you can
                  install it on both Android and iOS devices for a near-native
                  experience. The first iteration was a simple prototype to
                  practice my skills in Angular during a university break, as I
                  had a major project that was written with that framework. You
                  can find that history of that in the commits. I am now working
                  on the second iteration, written in NextJS.
                </p>
              </div>

              <Separator />

              {/* The Return */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Plot Twist: The Return! 🎉
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  In an unexpected turn of events, the legend himself has
                  returned! N00tavailable (now{" "}
                  <a
                    href="https://github.com/nooowavailable"
                    className="text-primary hover:text-primary/80 underline underline-offset-2 hover:underline-offset-4 transition-all duration-200"
                  >
                    <span className="font-medium text-foreground">
                      nooowavailable
                    </span>
                  </a>
                  ) is back and has released{" "}
                  <a
                    href="https://github.com/nooowavailable/tunedetectivex"
                    className="text-primary hover:text-primary/80 underline underline-offset-2 hover:underline-offset-4 transition-all duration-200"
                  >
                    <span className="font-medium text-foreground">
                      Tune Detective X
                    </span>
                  </a>{" "}
                  — a shiny new native app packed with cool new features that'll
                  blow your mind.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <span className="text-lg">📱</span>
                    Want the full native experience? Check out ) is back and has
                    released{" "}
                    <a
                      href="https://github.com/nooowavailable/tunedetectivex"
                      className="text-primary hover:text-primary/80 underline underline-offset-2 hover:underline-offset-4 transition-all duration-200"
                    >
                      <span className="font-medium text-foreground">
                        Tune Detective X
                      </span>
                    </a>
                    for all the latest features!
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  But hey, if you're a web person or just prefer self hosting,
                  you're absolutely welcome here! This web version will continue
                  to serve all you lovely web users. 🌐
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Current Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Current Status
                <Badge
                  variant="outline"
                  className="text-amber-600 border-amber-600"
                >
                  In Development
                </Badge>
              </CardTitle>
              <CardDescription>
                What to expect and what's coming next
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <span className="text-lg">🙃</span>
                  The project is still under (semi-)active development —
                  apologies if it breaks occasionally!
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Future Plans</h4>
                <p className="text-muted-foreground text-sm">
                  With Tune Detective X now available for native app lovers,
                  this web version will focus on providing the best possible
                  browser experience. The PWA should still provide excellent
                  mobile experience across all platforms for those who prefer
                  it.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
              <CardDescription>
                Built with modern web technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl">⚛️</div>
                  <div className="text-sm font-medium">Next.js</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl">📱</div>
                  <div className="text-sm font-medium">PWA Ready</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl">🎵</div>
                  <div className="text-sm font-medium">Deezer API</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl">🏠</div>
                  <div className="text-sm font-medium">Self-Hostable</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
