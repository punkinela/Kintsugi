# Airline Sentiment Analysis - Bolt.new App

This document contains the complete code to recreate the Twitter Airline Sentiment Analysis from the Colab notebook as a web application for bolt.new.

## 🚀 Quick Start for Bolt.new

1. Go to https://bolt.new
2. Copy and paste the code sections below into the appropriate files
3. The app will automatically build and deploy

---

## 📁 File Structure

```
airline-sentiment-app/
├── package.json
├── index.html
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── SentimentAnalyzer.jsx
│   │   ├── ModelComparison.jsx
│   │   ├── ResultsDisplay.jsx
│   │   └── TweetInput.jsx
│   ├── utils/
│   │   ├── sentimentEngine.js
│   │   └── textPreprocessor.js
│   └── styles/
│       └── App.css
```

---

## 📦 package.json

```json
{
  "name": "airline-sentiment-analyzer",
  "version": "1.0.0",
  "description": "Twitter Airline Sentiment Analysis Web App",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "sentiment": "^5.0.2",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

---

## 🏠 index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Airline Sentiment Analysis</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

---

## 🎯 src/main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 📱 src/App.jsx

```jsx
import React, { useState } from 'react';
import { Plane, Brain, BarChart3 } from 'lucide-react';
import SentimentAnalyzer from './components/SentimentAnalyzer';
import ModelComparison from './components/ModelComparison';

function App() {
  const [activeTab, setActiveTab] = useState('analyzer');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <Plane size={32} className="logo-icon" />
          <h1>Airline Sentiment Analyzer</h1>
          <p className="subtitle">ML-Powered Tweet Sentiment Classification</p>
        </div>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'analyzer' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyzer')}
        >
          <Brain size={20} />
          Analyze Sentiment
        </button>
        <button
          className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          <BarChart3 size={20} />
          Model Comparison
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'analyzer' && <SentimentAnalyzer />}
        {activeTab === 'comparison' && <ModelComparison />}
      </main>

      <footer className="app-footer">
        <p>Based on the Twitter US Airline Sentiment Dataset</p>
        <p>Using NLP techniques: TF-IDF, Lemmatization, Stopword Removal</p>
      </footer>
    </div>
  );
}

export default App;
```

---

## 🧠 src/components/SentimentAnalyzer.jsx

```jsx
import React, { useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import TweetInput from './TweetInput';
import ResultsDisplay from './ResultsDisplay';
import { analyzeSentiment } from '../utils/sentimentEngine';

function SentimentAnalyzer() {
  const [tweet, setTweet] = useState('');
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  const handleAnalyze = () => {
    if (!tweet.trim()) return;

    const analysis = analyzeSentiment(tweet);
    const newResult = {
      id: Date.now(),
      text: tweet,
      ...analysis,
      timestamp: new Date().toLocaleTimeString()
    };

    setResults(newResult);
    setHistory(prev => [newResult, ...prev].slice(0, 10));
  };

  const clearHistory = () => {
    setHistory([]);
    setResults(null);
    setTweet('');
  };

  return (
    <div className="sentiment-analyzer">
      <div className="analyzer-card">
        <h2>Analyze Airline Tweet</h2>
        <TweetInput
          value={tweet}
          onChange={setTweet}
          onAnalyze={handleAnalyze}
        />

        {results && <ResultsDisplay results={results} />}
      </div>

      {history.length > 0 && (
        <div className="history-card">
          <div className="history-header">
            <h3>Analysis History</h3>
            <button onClick={clearHistory} className="clear-button">
              <Trash2 size={16} />
              Clear
            </button>
          </div>
          <div className="history-list">
            {history.map(item => (
              <div key={item.id} className="history-item">
                <div className="history-text">{item.text}</div>
                <div className="history-meta">
                  <span className={`sentiment-badge ${item.sentiment}`}>
                    {item.sentiment}
                  </span>
                  <span className="confidence">
                    {(item.confidence * 100).toFixed(1)}% confident
                  </span>
                  <span className="timestamp">{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SentimentAnalyzer;
```

---

## 📝 src/components/TweetInput.jsx

```jsx
import React from 'react';
import { Send, Sparkles } from 'lucide-react';

const SAMPLE_TWEETS = [
  "@VirginAmerica flight was amazing! Crew was so friendly and helpful.",
  "@united worst experience ever. Flight delayed 3 hours with no updates.",
  "@SouthwestAir great service as always! On time and comfortable.",
  "@AmericanAir lost my luggage and customer service was terrible.",
  "@JetBlue thanks for the smooth flight and free wifi!"
];

function TweetInput({ value, onChange, onAnalyze }) {
  const useSample = () => {
    const randomTweet = SAMPLE_TWEETS[Math.floor(Math.random() * SAMPLE_TWEETS.length)];
    onChange(randomTweet);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAnalyze();
    }
  };

  return (
    <div className="tweet-input-container">
      <textarea
        className="tweet-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter an airline-related tweet to analyze sentiment...&#10;&#10;Example: @Delta excellent service! My flight was on time and the crew was wonderful."
        rows={4}
        maxLength={280}
      />
      <div className="input-controls">
        <button onClick={useSample} className="sample-button">
          <Sparkles size={16} />
          Try Sample
        </button>
        <span className="char-count">{value.length}/280</span>
        <button
          onClick={onAnalyze}
          disabled={!value.trim()}
          className="analyze-button"
        >
          <Send size={16} />
          Analyze
        </button>
      </div>
    </div>
  );
}

export default TweetInput;
```

---

## 📊 src/components/ResultsDisplay.jsx

```jsx
import React from 'react';
import { ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';

function ResultsDisplay({ results }) {
  const { sentiment, confidence, score, features } = results;

  const getSentimentIcon = () => {
    if (sentiment === 'positive') return <ThumbsUp size={32} />;
    if (sentiment === 'negative') return <ThumbsDown size={32} />;
    return <TrendingUp size={32} />;
  };

  const getSentimentColor = () => {
    if (sentiment === 'positive') return '#10b981';
    if (sentiment === 'negative') return '#ef4444';
    return '#f59e0b';
  };

  return (
    <div className="results-display">
      <div className="sentiment-result" style={{ borderColor: getSentimentColor() }}>
        <div className="sentiment-icon" style={{ color: getSentimentColor() }}>
          {getSentimentIcon()}
        </div>
        <div className="sentiment-info">
          <h3 className="sentiment-label" style={{ color: getSentimentColor() }}>
            {sentiment.toUpperCase()}
          </h3>
          <div className="confidence-bar-container">
            <div
              className="confidence-bar"
              style={{
                width: `${confidence * 100}%`,
                backgroundColor: getSentimentColor()
              }}
            />
          </div>
          <p className="confidence-text">
            Confidence: {(confidence * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="analysis-details">
        <h4>Analysis Details</h4>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Sentiment Score:</span>
            <span className="detail-value">{score}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Positive Words:</span>
            <span className="detail-value">{features.positiveWords.length}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Negative Words:</span>
            <span className="detail-value">{features.negativeWords.length}</span>
          </div>
        </div>

        {features.positiveWords.length > 0 && (
          <div className="word-tags">
            <strong>Positive indicators:</strong>
            <div className="tags">
              {features.positiveWords.slice(0, 5).map((word, i) => (
                <span key={i} className="tag positive-tag">{word}</span>
              ))}
            </div>
          </div>
        )}

        {features.negativeWords.length > 0 && (
          <div className="word-tags">
            <strong>Negative indicators:</strong>
            <div className="tags">
              {features.negativeWords.slice(0, 5).map((word, i) => (
                <span key={i} className="tag negative-tag">{word}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsDisplay;
```

---

## 📈 src/components/ModelComparison.jsx

```jsx
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Data from the Colab notebook results
const MODEL_RESULTS = [
  { name: 'Logistic Regression', accuracy: 0.9095, precision: 0.9105, recall: 0.6745, f1: 0.7745, rocAuc: 0.7379 },
  { name: 'Naive Bayes', accuracy: 0.8951, precision: 0.8526, recall: 0.7092, f1: 0.7745, rocAuc: 0.7551 },
  { name: 'Random Forest', accuracy: 0.8965, precision: 0.9142, recall: 0.6519, f1: 0.7606, rocAuc: 0.7265 },
  { name: 'Gradient Boosting', accuracy: 0.8937, precision: 0.8966, recall: 0.6606, f1: 0.7606, rocAuc: 0.7308 },
  { name: 'XGBoost', accuracy: 0.8951, precision: 0.9015, recall: 0.6635, f1: 0.7638, rocAuc: 0.7327 },
  { name: 'LightGBM', accuracy: 0.8965, precision: 0.9028, recall: 0.6693, f1: 0.7685, rocAuc: 0.7745 },
  { name: 'CatBoost', accuracy: 0.8985, precision: 0.9173, recall: 0.6562, f1: 0.7654, rocAuc: 0.7288 },
];

function ModelComparison() {
  const chartData = {
    labels: MODEL_RESULTS.map(m => m.name),
    datasets: [
      {
        label: 'Accuracy',
        data: MODEL_RESULTS.map(m => m.accuracy),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'ROC-AUC',
        data: MODEL_RESULTS.map(m => m.rocAuc),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'F1 Score',
        data: MODEL_RESULTS.map(m => m.f1),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Model Performance Comparison (From Colab Notebook)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
  };

  return (
    <div className="model-comparison">
      <div className="comparison-header">
        <h2>ML Model Performance</h2>
        <p>Comparing 7 different classifiers trained on ~14,640 airline tweets</p>
      </div>

      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>

      <div className="model-table">
        <h3>Detailed Metrics</h3>
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Accuracy</th>
              <th>Precision</th>
              <th>Recall</th>
              <th>F1 Score</th>
              <th>ROC-AUC</th>
            </tr>
          </thead>
          <tbody>
            {MODEL_RESULTS.map((model, idx) => (
              <tr key={idx} className={model.name === 'LightGBM' ? 'best-model' : ''}>
                <td>{model.name}</td>
                <td>{(model.accuracy * 100).toFixed(2)}%</td>
                <td>{(model.precision * 100).toFixed(2)}%</td>
                <td>{(model.recall * 100).toFixed(2)}%</td>
                <td>{model.f1.toFixed(4)}</td>
                <td>{model.rocAuc.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="table-note">
          <strong>Best ROC-AUC:</strong> LightGBM (0.7745) |
          <strong> Best Accuracy:</strong> Logistic Regression (90.95%)
        </p>
      </div>

      <div className="methodology-card">
        <h3>Methodology (From Colab Notebook)</h3>
        <ul>
          <li><strong>Dataset:</strong> Twitter US Airline Sentiment (~14,640 tweets)</li>
          <li><strong>Preprocessing:</strong> Lowercasing, HTML/URL removal, punctuation removal, tokenization</li>
          <li><strong>Features:</strong> TF-IDF vectorization (5,000 top features)</li>
          <li><strong>Text Processing:</strong> NLTK stopword removal, lemmatization</li>
          <li><strong>Classification:</strong> Binary (positive vs. neutral/negative)</li>
          <li><strong>Evaluation:</strong> 5-fold cross-validation, multiple metrics</li>
        </ul>
      </div>
    </div>
  );
}

export default ModelComparison;
```

---

## 🔧 src/utils/sentimentEngine.js

```javascript
// Simplified sentiment analysis engine
// In production, this would call a backend API with the trained models from the Colab notebook

const POSITIVE_WORDS = [
  'amazing', 'excellent', 'great', 'fantastic', 'wonderful', 'awesome', 'perfect',
  'love', 'best', 'friendly', 'helpful', 'smooth', 'comfortable', 'professional',
  'quick', 'efficient', 'clean', 'thanks', 'appreciate', 'recommend', 'happy'
];

const NEGATIVE_WORDS = [
  'worst', 'terrible', 'horrible', 'awful', 'bad', 'poor', 'delayed', 'cancelled',
  'lost', 'rude', 'disappointed', 'frustrating', 'annoying', 'angry', 'unacceptable',
  'disgusting', 'useless', 'nightmare', 'horrible', 'hate', 'never', 'complaint'
];

export function analyzeSentiment(text) {
  const cleaned = preprocessText(text);
  const words = cleaned.split(/\s+/);

  let positiveScore = 0;
  let negativeScore = 0;
  const foundPositive = [];
  const foundNegative = [];

  words.forEach(word => {
    if (POSITIVE_WORDS.includes(word)) {
      positiveScore++;
      foundPositive.push(word);
    }
    if (NEGATIVE_WORDS.includes(word)) {
      negativeScore++;
      foundNegative.push(word);
    }
  });

  const totalScore = positiveScore - negativeScore;
  let sentiment = 'neutral';
  let confidence = 0.5;

  if (totalScore > 0) {
    sentiment = 'positive';
    confidence = Math.min(0.95, 0.6 + (positiveScore * 0.1));
  } else if (totalScore < 0) {
    sentiment = 'negative';
    confidence = Math.min(0.95, 0.6 + (negativeScore * 0.1));
  } else if (positiveScore === 0 && negativeScore === 0) {
    confidence = 0.3;
  }

  return {
    sentiment,
    confidence,
    score: totalScore,
    features: {
      positiveWords: foundPositive,
      negativeWords: foundNegative,
      wordCount: words.length
    }
  };
}

function preprocessText(text) {
  return text
    .toLowerCase()
    .replace(/@\w+/g, '') // Remove mentions
    .replace(/https?:\/\/\S+/g, '') // Remove URLs
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}
```

---

## 🎨 src/styles/App.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #3b82f6;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --card-bg: #ffffff;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f3f4f6;
  color: var(--text-primary);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--bg-gradient);
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.logo-icon {
  display: inline-block;
  margin-bottom: 0.5rem;
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.tab-navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 1rem;
  background: white;
  border-bottom: 2px solid var(--border-color);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tab-button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Sentiment Analyzer */
.sentiment-analyzer {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.analyzer-card,
.history-card,
.comparison-header,
.methodology-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.analyzer-card h2,
.history-card h3 {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.tweet-input-container {
  margin-bottom: 1.5rem;
}

.tweet-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.tweet-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.input-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
}

.sample-button,
.analyze-button,
.clear-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sample-button {
  background: var(--warning-color);
  color: white;
}

.analyze-button {
  background: var(--primary-color);
  color: white;
}

.analyze-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-button {
  background: var(--danger-color);
  color: white;
  padding: 0.5rem 1rem;
}

.sample-button:hover,
.analyze-button:hover:not(:disabled),
.clear-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.char-count {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Results Display */
.results-display {
  margin-top: 2rem;
}

.sentiment-result {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  border: 3px solid;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.sentiment-icon {
  font-size: 3rem;
}

.sentiment-info {
  flex: 1;
}

.sentiment-label {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.confidence-bar-container {
  width: 100%;
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.confidence-bar {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 6px;
}

.confidence-text {
  font-size: 1rem;
  color: var(--text-secondary);
}

.analysis-details {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
}

.analysis-details h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
}

.detail-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.detail-value {
  font-weight: 700;
  color: var(--primary-color);
}

.word-tags {
  margin-top: 1rem;
}

.word-tags strong {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.positive-tag {
  background: #d1fae5;
  color: #065f46;
}

.negative-tag {
  background: #fee2e2;
  color: #991b1b;
}

/* History */
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.history-text {
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.history-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
}

.sentiment-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.sentiment-badge.positive {
  background: var(--success-color);
  color: white;
}

.sentiment-badge.negative {
  background: var(--danger-color);
  color: white;
}

.sentiment-badge.neutral {
  background: var(--warning-color);
  color: white;
}

.confidence {
  color: var(--text-secondary);
}

.timestamp {
  color: var(--text-secondary);
  margin-left: auto;
}

/* Model Comparison */
.model-comparison {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.comparison-header {
  text-align: center;
}

.comparison-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.comparison-header p {
  color: var(--text-secondary);
}

.chart-container {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
}

.model-table {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.model-table h3 {
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: var(--bg-gradient);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

tr:hover {
  background: #f9fafb;
}

.best-model {
  background: #fef3c7 !important;
  font-weight: 600;
}

.table-note {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0f9ff;
  border-left: 4px solid var(--primary-color);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.methodology-card h3 {
  margin-bottom: 1rem;
}

.methodology-card ul {
  list-style: none;
  padding-left: 0;
}

.methodology-card li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.methodology-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--success-color);
  font-weight: 700;
}

/* Footer */
.app-footer {
  background: white;
  border-top: 2px solid var(--border-color);
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.app-footer p {
  margin: 0.5rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .tab-navigation {
    flex-direction: column;
  }

  .sentiment-result {
    flex-direction: column;
    text-align: center;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .chart-container {
    height: 300px;
  }

  table {
    font-size: 0.85rem;
  }

  th, td {
    padding: 0.5rem;
  }
}
```

---

## 🚀 Deployment Instructions

### For Bolt.new:

1. **Go to** https://bolt.new
2. **Create a new project** - Select "React + Vite"
3. **Copy each file** from above into the corresponding location in bolt.new
4. The app will auto-build and deploy!

### Features Included:

✅ **Sentiment Analyzer** - Analyze airline tweets in real-time
✅ **Model Comparison** - View performance metrics from all 7 ML models
✅ **Interactive UI** - Beautiful, responsive design
✅ **Analysis History** - Track your sentiment analysis results
✅ **Sample Tweets** - Try with pre-loaded examples
✅ **Detailed Metrics** - See positive/negative word indicators

### Next Steps (Optional Enhancements):

1. **Connect to Backend API** - Replace the client-side sentiment engine with actual ML models
2. **Add More Models** - Implement BERT, RoBERTa, or other transformer models
3. **Real-time Analysis** - Add batch processing for multiple tweets
4. **Export Results** - Download analysis results as CSV/JSON
5. **User Authentication** - Save analysis history to a database

---

## 📚 Technical Notes

This web app recreates the functionality of the Colab notebook in a browser-friendly format:

- **Original Notebook**: Used Python, scikit-learn, XGBoost, LightGBM, CatBoost
- **Web App**: Uses JavaScript with a simplified sentiment analysis
- **Model Results**: Preserved from the actual trained models (shown in Model Comparison tab)
- **For Production**: You'd want to deploy the trained models via a Python API (FastAPI/Flask) and call it from the frontend

Enjoy your airline sentiment analyzer! ✈️
