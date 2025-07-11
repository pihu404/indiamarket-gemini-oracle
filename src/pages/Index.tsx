
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StockAnalysis } from "@/components/StockAnalysis";
import { PredictionResult } from "@/types/stock";

const Index = () => {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const analyzStock = async () => {
    if (!symbol.trim()) {
      toast({
        title: "Error",
        description: "Please enter a stock symbol",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: symbol.toUpperCase() }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze stock');
      }

      const result = await response.json();
      setPrediction(result);
      
      toast({
        title: "Analysis Complete",
        description: `Generated prediction for ${symbol.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error analyzing stock:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze stock. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Stock Market Oracle
          </h1>
          <p className="text-lg text-muted-foreground">
            Powered by Gemini AI for intelligent market predictions
          </p>
        </div>

        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Stock Analysis
            </CardTitle>
            <CardDescription>
              Enter a stock symbol to get AI-powered market insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL, TSLA, MSFT"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && analyzStock()}
                className="uppercase"
              />
            </div>
            <Button 
              onClick={analyzStock} 
              disabled={loading || !symbol.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analyze Stock
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {prediction && <StockAnalysis prediction={prediction} />}

        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-semibold mb-1">Disclaimer</p>
                <p>
                  This AI analysis is for educational purposes only and should not be considered as financial advice. 
                  Always consult with qualified financial advisors before making investment decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
