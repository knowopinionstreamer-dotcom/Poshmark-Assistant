import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Package, ArrowRight, Sparkles, Zap } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-headline text-primary">Reseller Command Center</h1>
          <p className="text-xl text-muted-foreground">Supercharge your workflow with AI-powered listing tools.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create New Listing</CardTitle>
            <CardDescription>Launch the AI flow to analyze photos, research prices, and generate drafts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/new-listing">
                <Button size="lg" className="w-full">
                    Start Listing Flow
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
          </CardContent>
          <Sparkles className="absolute -bottom-4 -right-4 h-24 w-24 text-primary/5 rotate-12" />
        </Card>

        <Card className="border-secondary/20 bg-gradient-to-br from-background to-secondary/5">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-secondary" />
            </div>
            <CardTitle className="text-2xl">Flyp Dashboard</CardTitle>
            <CardDescription>Manage your inventory, cross-list to marketplaces, and track your sales.</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="https://tools.joinflyp.com/my-items" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary" className="w-full">
                    Open Flyp Inventory
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center space-y-2">
                <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-bold text-lg">Laser Search</h3>
                <p className="text-sm text-muted-foreground text-pretty">AI scourers your photos for style codes to find exact market matches.</p>
            </CardContent>
         </Card>
         <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center space-y-2">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-bold text-lg">Pro Descriptions</h3>
                <p className="text-sm text-muted-foreground text-pretty">Optimized keywords and clean formatting designed to increase conversions.</p>
            </CardContent>
         </Card>
         <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center space-y-2">
                <ArrowRight className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-bold text-lg">Quick Copy</h3>
                <p className="text-sm text-muted-foreground text-pretty">Dedicated one-click buttons to instantly move data to your listings.</p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}