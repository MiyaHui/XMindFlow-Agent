import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainIcon, 
  UploadIcon, 
  CheckIcon, 
  FileIcon, 
  TagIcon, 
  SettingsIcon, 
  LoadingIcon,
  StepIcon
} from './components/AnimatedIcons';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Database, 
  Cpu, 
  FileSearch,
  Layout,
  FileCheck,
  FilePlus
} from 'lucide-react';

type Step = 'upload' | 'configure' | 'processing' | 'results';

interface WorkflowResult {
  productProposal: string;
  prototypeHtml: string;
  prdDocument: string;
  labelledHtml: string;
}

function App() {
  const [step, setStep] = useState<Step>('upload');
  const [xmindContent, setXmindContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [config, setConfig] = useState({
    expandModel: 'qwen3-max',
    prototypeModel: 'deepseek-reasoner',
    prdModel: 'qwen3-max',
    apiKeys: {
      qwen: '',
      deepseek: '',
    }
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<WorkflowResult | null>(null);
  const [error, setError] = useState('');

  const steps = [
    { name: '上传', description: '上传 Xmind 文件', icon: UploadIcon },
    { name: '配置', description: '配置 API 和模型', icon: SettingsIcon },
    { name: '处理', description: 'AI 工作流处理', icon: Cpu },
    { name: '结果', description: '查看产出物', icon: FileCheck },
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setXmindContent(e.target?.result as string);
        setFileName(file.name);
        setStep('configure');
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/markdown': ['.md'] },
    multiple: false,
  });

  const handleTextInput = (content: string) => {
    setXmindContent(content);
    setFileName('直接输入.md');
    setStep('configure');
  };

  const startProcessing = async () => {
    setStep('processing');
    setCurrentStep(1);
    setError('');

    try {
      // Simulate steps for UI feedback
      const response = await fetch('http://localhost:5000/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xmindContent,
          config,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '处理失败');
      }

      const data = await response.json();
      setResults(data);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理过程中发生错误');
      setStep('configure');
    }
  };

  const renderUpload = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="inline-block p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-6"
        >
          <BrainIcon size={48} className="text-indigo-400" animate />
        </motion.div>
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight">
          <span className="gradient-text">XMindFlow</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
          Transform your mind maps into high-fidelity prototypes and PRDs with the power of AI.
        </p>
      </div>

      <div className="glass-card p-1 items-center mb-12">
        <div
          {...getRootProps()}
          className={`upload-area ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/10 text-indigo-400">
            <UploadIcon size={40} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white">
            {isDragActive ? 'Drop your file here' : 'Drop XMind Markdown here'}
          </h3>
          <p className="text-slate-400 mb-2">or click to browse from your computer</p>
          <p className="text-xs text-slate-500 font-mono">Supports .md (XMind exported as Markdown)</p>
        </div>

        <div className="p-8 border-t border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-grow bg-white/10" />
            <span className="text-slate-500 text-sm font-medium uppercase tracking-widest">or paste content</span>
            <div className="h-px flex-grow bg-white/10" />
          </div>
          <textarea
            className="w-full h-32 input-field text-slate-300 placeholder:text-slate-600 resize-none"
            placeholder="Paste your XMind Markdown content here..."
            onChange={(e) => handleTextInput(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Search, title: 'Analyze', desc: 'AI structure analysis', color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { icon: Layout, title: 'Prototype', desc: 'Hi-fi HTML output', color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { icon: Sparkles, title: 'Write PRD', desc: 'AI-generated specs', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
          { icon: FileSearch, title: 'Annotate', desc: 'Interactive labels', color: 'text-orange-400', bg: 'bg-orange-400/10' },
        ].map((item, i) => (
          <div key={i} className="step-card group">
            <div className={`mb-4 p-3 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon size={28} />
            </div>
            <h3 className="font-bold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderConfigure = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Workflow Settings</span>
        </h1>
        <p className="text-slate-400">Configure your model endpoints and API keys</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-8">
              <Database className="text-indigo-400" />
              <h2 className="text-xl font-bold text-white">API Keys</h2>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-slate-400 mb-2 group-focus-within:text-indigo-400 transition-colors">Qwen API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    className="w-full input-field pr-12"
                    placeholder="sk-..."
                    value={config.apiKeys.qwen}
                    onChange={(e) => setConfig({ ...config, apiKeys: { ...config.apiKeys, qwen: e.target.value } })}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
                    <CheckIcon size={16} />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-slate-400 mb-2 group-focus-within:text-indigo-400 transition-colors">DeepSeek API Key</label>
                <input
                  type="password"
                  className="w-full input-field"
                  placeholder="sk-..."
                  value={config.apiKeys.deepseek}
                  onChange={(e) => setConfig({ ...config, apiKeys: { ...config.apiKeys, deepseek: e.target.value } })}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 font-medium">
             <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-indigo-400" />
              <h3 className="text-lg text-white">Selected File</h3>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <FileIcon className="text-indigo-400" />
                <span className="text-white font-mono text-sm">{fileName}</span>
              </div>
              <span className="text-xs text-slate-500">{xmindContent.length} characters</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <Cpu className="text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Model Selection</h2>
            </div>

            <div className="space-y-6 flex-grow">
              {[
                { label: 'Parse Model', key: 'expandModel', options: ['qwen3-max', 'qwen3-8b'] },
                { label: 'Prototype Model', key: 'prototypeModel', options: ['deepseek-reasoner', 'deepseek-chat'] },
                { label: 'PRD Model', key: 'prdModel', options: ['qwen3-max', 'qwen3-8b'] },
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter mb-2">{item.label}</label>
                  <select
                    className="w-full input-field bg-slate-900 appearance-none cursor-pointer"
                    value={(config as any)[item.key]}
                    onChange={(e) => setConfig({ ...config, [item.key]: e.target.value })}
                  >
                    {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <button
                onClick={startProcessing}
                disabled={!config.apiKeys.qwen || !config.apiKeys.deepseek}
                className="w-full primary-button flex items-center justify-center gap-2 py-4"
              >
                <span>Run Pipeline</span>
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setStep('upload')}
                className="w-full glass-button py-4"
              >
                Back to Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderProcessing = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto text-center py-12"
    >
      <div className="mb-12">
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-3xl bg-indigo-500/20 rounded-full animate-pulse" />
          <LoadingIcon size={80} className="text-indigo-400 relative z-10" />
        </div>
        <h1 className="text-4xl font-bold mt-8 mb-4">
          <span className="gradient-text">Engine Processing...</span>
        </h1>
        <p className="text-slate-400">AI is transforming your thoughts into structure.</p>
      </div>

      <div className="glass-card p-8 space-y-6 text-left">
        {[
          { step: 1, name: 'Mind Map Decomposition', icon: Search },
          { step: 2, name: 'Prototype Architecture Generation', icon: Layout },
          { step: 3, name: 'Requirement Documentation', icon: Sparkles },
          { step: 4, name: 'Interactive Annotation Layer', icon: FileCheck },
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-6 p-4 rounded-xl transition-all duration-500 bg-white/5 border border-white/5">
            <StepIcon 
              icon={item.icon} 
              active={currentStep === item.step} 
              complete={currentStep > item.step || (step === 'results' && item.step <= 4)} 
            />
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold ${currentStep >= item.step ? 'text-white' : 'text-slate-600'}`}>
                  {item.name}
                </span>
                {currentStep > item.step && <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Done</span>}
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: currentStep > item.step ? '100%' : currentStep === item.step ? '60%' : '0%' }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center gap-2"
        >
          <span className="font-bold">Error:</span> {error}
        </motion.div>
      )}
    </motion.div>
  );

  const renderResults = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Generation Complete</span>
        </h1>
        <p className="text-slate-400 font-medium font-mono text-sm tracking-widest uppercase">Pipeline execution successful</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="result-card">
          <div className="result-header bg-indigo-500/10 text-indigo-400">
            <Sparkles size={20} />
            <h2>Product Proposal</h2>
          </div>
          <div className="result-body custom-scrollbar prose">
            <ReactMarkdown>
              {results?.productProposal || ''}
            </ReactMarkdown>
          </div>
        </div>

        <div className="result-card">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="result-header bg-purple-500/10 text-purple-400"
          >
            <Layout size={20} />
            <h2>Prototype Preview</h2>
          </motion.div>
          <div className="p-4 flex-grow bg-slate-900/50">
            <iframe
              srcDoc={results?.prototypeHtml}
              className="w-full h-full border border-white/10 rounded-xl bg-white"
              title="Prototype Preview"
            />
          </div>
        </div>

        <div className="result-card">
          <div className="result-header bg-cyan-500/10 text-cyan-400">
            <FileIcon size={20} />
            <h2>PRD Document</h2>
          </div>
          <div className="result-body custom-scrollbar prose">
            <ReactMarkdown>
              {results?.prdDocument || ''}
            </ReactMarkdown>
          </div>
        </div>

        <div className="result-card">
          <div className="result-header bg-orange-500/10 text-orange-400">
            <TagIcon size={20} />
            <h2>Interactive Annotations</h2>
          </div>
          <div className="p-4 flex-grow bg-slate-900/50">
            <iframe
              srcDoc={results?.labelledHtml}
              className="w-full h-full border border-white/10 rounded-xl bg-white"
              title="Labelled Prototype Preview"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-12">
        <button
          onClick={() => {
            setStep('upload');
            setXmindContent('');
            setResults(null);
          }}
          className="glass-button px-12 py-4 flex items-center gap-3 border-indigo-500/30 hover:border-indigo-500/60"
        >
          <FilePlus size={20} className="text-indigo-400" />
          <span>Process New Workflow</span>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="App selection:bg-indigo-500/30 selection:text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setStep('upload')}>
              <div className="p-2 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                <BrainIcon size={28} className="text-indigo-400" />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-white">XMindFlow</span>
            </div>
            <div className="hidden md:flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/5">
              {steps.map((s, i) => {
                // Simple logic for active state mapping
                const isItemActive = (step === 'upload' && i === 0) || 
                                   (step === 'configure' && i === 1) || 
                                   (step === 'processing' && i === 2) || 
                                   (step === 'results' && i === 3);

                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isItemActive 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${isItemActive ? 'bg-white/20' : 'bg-white/5'}`}>
                      {i + 1}
                    </span>
                    {s.name}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com" className="text-slate-400 hover:text-white transition-colors">
                 <motion.div whileHover={{ scale: 1.1 }}>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                      <Database size={18} />
                    </div>
                 </motion.div>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="section-container">
          <AnimatePresence mode="wait">
            {step === 'upload' && renderUpload()}
            {step === 'configure' && renderConfigure()}
            {step === 'processing' && renderProcessing()}
            {step === 'results' && renderResults()}
          </AnimatePresence>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-50">
            <BrainIcon size={20} />
            <span className="font-bold text-sm tracking-tight">XMindFlow AI v1.0</span>
          </div>
          <div className="text-slate-600 text-xs font-mono">
            BUILD WITH PASSION & INTELLIGENCE
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
