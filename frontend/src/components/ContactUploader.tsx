import React, { useRef, useState } from "react";
import { Button } from "./ui/button";

interface Contact {
  name: string;
  phone: string;
  selected: boolean;
}

interface ContactUploaderProps {
  onSubmit: (contacts: { name: string; phone: string }[]) => void;
  onClose: () => void;
}

const CSV_TEMPLATE = "name,phone\nAbhigyan Raj,9234567890\nSandeep Mehta,9876543210";

// Simulated modules list
const modules = [
  { id: "1", name: "Customer Feedback" },
  { id: "2", name: "Order Confirmation" },
  { id: "3", name: "Appointment Reminder" },
];

const ContactUploader: React.FC<ContactUploaderProps> = ({ onSubmit, onClose }) => {
  const [selectedModule, setSelectedModule] = useState(modules[0].id);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Minimal CSV parser: expects header row with 'name' and 'phone' columns
  const parseCSV = (csv: string) => {
    const lines = csv.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const nameIdx = headers.indexOf("name");
    const phoneIdx = headers.indexOf("phone");
    if (nameIdx === -1 || phoneIdx === -1) return [];
    return lines.slice(1).map(line => {
      const cols = line.split(",");
      return {
        name: cols[nameIdx]?.trim() || "",
        phone: cols[phoneIdx]?.trim() || "",
        selected: true,
      };
    }).filter(c => c.phone);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        setError("Invalid CSV. Use columns: name, phone");
        setContacts([]);
      } else {
        setContacts(parsed);
        setError("");
        setSuccess("CSV uploaded successfully!");
        setTimeout(() => setSuccess(""), 2000);
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSelectAll = (checked: boolean) => {
    setContacts(cs => cs.map(c => ({ ...c, selected: checked })));
  };

  const handleContactSelect = (idx: number, checked: boolean) => {
    setContacts(cs => cs.map((c, i) => i === idx ? { ...c, selected: checked } : c));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (contacts.length > 0) {
      const selected = contacts.filter(c => c.selected);
      if (selected.length === 0) {
        setError("Select at least one contact");
        return;
      }
      setSuccess(`Ready to call ${selected.length} contact(s)!`);
      setTimeout(() => {
        setSuccess("");
        onSubmit(selected.map(({ name, phone }) => ({ name, phone })));
        onClose();
      }, 1200);
      return;
    }
    // Manual entry fallback
    if (!manualName || !manualPhone) {
      setError("Enter name and phone");
      return;
    }
    setSuccess("Ready to call 1 contact!");
    setTimeout(() => {
      setSuccess("");
      onSubmit([{ name: manualName, phone: manualPhone }]);
      onClose();
    }, 1200);
  };

  // Filtered contacts for search
  const filteredContacts = search.trim()
    ? contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
      )
    : contacts;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Module select */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-white/80 font-medium">Select Module:</label>
        <select
          value={selectedModule}
          onChange={e => setSelectedModule(e.target.value)}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
        >
          {modules.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-white/80 font-medium">Upload CSV (name, phone):</label>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(CSV_TEMPLATE)}`}
          download="contacts_template.csv"
          className="text-xs text-blue-400 hover:underline"
        >
          Download template
        </a>
      </div>
      <div
        className={`rounded-lg border-2 border-dashed ${dragActive ? "border-blue-400 bg-blue-950/30" : "border-zinc-700 bg-zinc-900"} px-4 py-6 text-center cursor-pointer transition-colors`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="text-xs text-white/60">Drag & drop or click to upload CSV</span>
      </div>
      {contacts.length > 0 && (
        <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-700">
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-2 w-full rounded border border-zinc-700 px-3 py-1 text-xs bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
          />
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={filteredContacts.length > 0 && filteredContacts.every(c => c.selected)}
              onChange={e => handleSelectAll(e.target.checked)}
              className="mr-2 accent-blue-500"
            />
            <span className="text-xs text-white/70">Select All</span>
          </div>
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1">
            {filteredContacts.map((c, idx) => (
              <label
                key={idx}
                className={`flex items-center gap-2 text-xs px-2 py-1 rounded transition-colors ${c.selected ? "bg-blue-900/30 text-blue-200" : "text-white/80 hover:bg-zinc-800"}`}
                style={{ cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={c.selected}
                  onChange={e => handleContactSelect(contacts.indexOf(c), e.target.checked)}
                  className="accent-blue-500"
                />
                <span>{c.name} ({c.phone})</span>
              </label>
            ))}
            {filteredContacts.length === 0 && (
              <div className="text-xs text-zinc-400 text-center py-2">No contacts found.</div>
            )}
          </div>
        </div>
      )}
      {contacts.length === 0 && (
        <>
          <div className="border-t border-zinc-800 my-2" />
          <label className="text-sm text-white/80 font-medium">Or enter manually:</label>
          <input
            type="text"
            placeholder="Name"
            value={manualName}
            onChange={e => setManualName(e.target.value)}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 bg-zinc-800 text-white placeholder-zinc-400"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={manualPhone}
            onChange={e => setManualPhone(e.target.value)}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 bg-zinc-800 text-white placeholder-zinc-400"
          />
        </>
      )}
      {error && <div className="text-red-400 text-xs text-center font-medium">{error}</div>}
      {success && <div className="text-green-400 text-xs text-center font-medium">{success}</div>}
      <Button type="submit" className="mt-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors">Submit</Button>
    </form>
  );
};

export default ContactUploader; 