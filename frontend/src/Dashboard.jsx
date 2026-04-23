import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, Plus } from 'lucide-react';
import api from './api';

export default function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await api.get('/notes');
            setNotes(res.data);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        
        setLoading(true);
        try {
            const res = await api.post('/notes', { content });
            setNotes([res.data, ...notes]);
            setContent('');
        } catch (error) {
            console.error("Failed to add note", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Sparkles className="text-blue-600" /> AI Research Notebook
                    </h1>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition">
                        <LogOut size={20} /> Logout
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your research text or ideas here..."
                        className="w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-y mb-4"
                        required
                    />
                    <button disabled={loading} type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-400">
                        {loading ? 'AI is summarizing...' : <><Plus size={20} /> Save & Summarize</>}
                    </button>
                </form>

                <div className="grid gap-6 md:grid-cols-2">
                    {notes.map(note => (
                        <div key={note._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
                            <p className="text-gray-700 mb-4 flex-grow whitespace-pre-wrap">{note.content}</p>
                            <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                                <p className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-1">
                                    <Sparkles size={14} /> AI Summary
                                </p>
                                <p className="text-sm text-blue-900">{note.aiSummary}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}