
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Target, Clock, AlertTriangle, BarChart3 } from "lucide-react";
import { PredictionResult } from "@/types/stock";

interface StockAnalysisProps {
  prediction: PredictionResult;
}

export const StockAnalysis = ({ prediction }: StockAnalysisProps) => {
  const getPredictionIcon = () => {
    switch (prediction.prediction) {
      case 'BULLISH':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'BEARISH':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getPredictionColor = () => {
    switch (prediction.prediction) {
      case 'BULLISH':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'BEARISH':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getRecommendationColor = () => {
    switch (prediction.recommendation) {
      case 'BUY':
        return 'bg-green-500';
      case 'SELL':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  // Format currency in Indian Rupees
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Calculate price difference
  const priceDifference = prediction.priceTarget - prediction.currentPrice;
  const percentageChange = (priceDifference / prediction.currentPrice) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getPredictionIcon()}
              {prediction.symbol} - {prediction.companyName}
            </div>
            <Badge className={getPredictionColor()}>
              {prediction.prediction}
            </Badge>
          </CardTitle>
          <CardDescription>
            Current Price: {formatINR(prediction.currentPrice)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Target className="h-4 w-4" />
                Price Target
              </Label>
              <p className="text-2xl font-bold">{formatINR(prediction.priceTarget)}</p>
              <p className={`text-sm ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {percentageChange >= 0 ? '↗' : '↘'} {Math.abs(percentageChange).toFixed(1)}% from current
              </p>
              <p className="text-xs text-muted-foreground">
                {priceDifference >= 0 ? '+' : ''}{formatINR(priceDifference)} potential change
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Confidence Level
              </Label>
              <div className="space-y-1">
                <Progress value={prediction.confidence} className="h-2" />
                <p className="text-sm text-muted-foreground">{prediction.confidence}%</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Timeframe
              </Label>
              <p className="text-lg font-semibold">{prediction.timeframe}</p>
              <Badge className={`${getRecommendationColor()} text-white`}>
                {prediction.recommendation}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{prediction.reasoning}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Market Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Sentiment:</span>
              <Badge variant={prediction.marketSentiment === 'POSITIVE' ? 'default' : 
                             prediction.marketSentiment === 'NEGATIVE' ? 'destructive' : 'secondary'}>
                {prediction.marketSentiment}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Volatility:</span>
              <Badge variant={prediction.volatilityLevel === 'HIGH' ? 'destructive' : 
                             prediction.volatilityLevel === 'MEDIUM' ? 'secondary' : 'default'}>
                {prediction.volatilityLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Technical Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {prediction.technicalFactors.map((factor, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {prediction.riskFactors.map((risk, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Create a simple Label component since it's not in the existing UI components
const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...props}>
      {children}
    </label>
  );
};
