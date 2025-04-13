import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-7xl">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Content Section */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
              </div>
              
              <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
                <div className="space-y-6">
                  <blockquote className="border-l-4 border-primary pl-4 italic">
                    As students, we have looked for upskilling everywhere. Mostly, we end up 
                    paying big amounts to gain certifications and learn relevant skills. 
                    We thought of TalentTrade to resolve that. Learning new skills and gaining 
                    more knowledge all while networking with talented people!
                  </blockquote>
                  
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      At TalentTrade, we believe in the power of learning and sharing knowledge. 
                      Our platform connects individuals from diverse backgrounds to exchange 
                      practical skills and expertise. Whether you're a seasoned professional 
                      looking to mentor others or a beginner eager to learn, TalentTrade 
                      provides a supportive environment for growth and collaboration.
                    </p>
                    
                    <p>
                      Our mission is to empower individuals to unlock their full potential 
                      through skill sharing. By facilitating meaningful interactions and 
                      fostering a culture of lifelong learning, we aim to create a community 
                      where everyone has the opportunity to thrive.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Image Section */}
            <div className="relative h-[300px] md:h-auto overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="People collaborating"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}