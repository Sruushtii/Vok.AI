import React, { useState } from "react";
import { Button } from "./ui/button";
import { X, GripVertical } from "lucide-react";

interface CreateModuleProps {
  open: boolean;
  onClose: () => void;
}

const CreateModule: React.FC<CreateModuleProps> = ({ open, onClose }) => {
  const [companyName, setCompanyName] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [moduleSuccess, setModuleSuccess] = useState(false);

  const handleQuestionChange = (idx: number, value: string) => {
    setQuestions(qs => qs.map((q, i) => (i === idx ? value : q)));
  };
  const addQuestion = () => setQuestions(qs => [...qs, ""]);
  const removeQuestion = (idx: number) => setQuestions(qs => qs.length > 1 ? qs.filter((_, i) => i !== idx) : qs);

  // Drag and drop handlers
  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    setQuestions(qs => {
      const arr = [...qs];
      const [removed] = arr.splice(draggedIdx, 1);
      arr.splice(idx, 0, removed);
      return arr;
    });
    setDraggedIdx(idx);
  };
  const handleDragEnd = () => setDraggedIdx(null);

  const handleModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModuleSuccess(true);
    setTimeout(() => setModuleSuccess(false), 2000);
    setCompanyName("");
    setQuestions([""]);
    onClose();
    // For now, just log
    console.log({ companyName, questions });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 animate-fade-in border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-400 hover:text-white focus:outline-none"
          aria-label="Close"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-lg font-semibold text-white mb-4 text-center">Create Module</h2>
        <form onSubmit={handleModuleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            required
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 bg-zinc-800 text-white placeholder-zinc-400"
          />
          <div className="flex flex-col gap-2">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="flex gap-2 items-center"
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={e => { e.preventDefault(); handleDragOver(idx); }}
                onDragEnd={handleDragEnd}
                style={{ opacity: draggedIdx === idx ? 0.5 : 1, cursor: "grab" }}
              >
                <span className="p-1 text-zinc-400 cursor-grab"><GripVertical className="w-4 h-4" /></span>
                <input
                  type="text"
                  placeholder={`Question ${idx + 1}`}
                  value={q}
                  onChange={e => handleQuestionChange(idx, e.target.value)}
                  required
                  className="flex-1 rounded-lg border border-zinc-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 bg-zinc-800 text-white placeholder-zinc-400"
                />
                <Button type="button" variant="ghost" className="p-1" onClick={() => removeQuestion(idx)} disabled={questions.length === 1} title="Remove">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" className="mt-2 font-medium bg-white text-black hover:bg-gray-100" onClick={addQuestion}>+ Add Question</Button>
          </div>
          <Button type="submit" className="mt-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors">Save Module</Button>
          {moduleSuccess && <div className="text-green-400 text-xs text-center">Module created!</div>}
        </form>
      </div>
    </div>
  );
};

export default CreateModule; 