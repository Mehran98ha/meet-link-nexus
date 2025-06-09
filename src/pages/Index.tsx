import React, { useState, useEffect } from 'react';
import { Plus, Clock, User, FileText, ExternalLink } from 'lucide-react';

interface MeetLink {
  id: string;
  url: string;
  name: string;
  creator: string;
  notes: string;
  timestamp: string;
}

const Index = () => {
  const [links, setLinks] = useState<MeetLink[]>([]);
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    creator: '',
    notes: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [expandedNotes, setExpandedNotes] = useState<{ [key: string]: boolean }>({});

  // Initialize with demo link
  useEffect(() => {
    const demoLink: MeetLink = {
      id: '1',
      url: 'https://meet.google.com/hep-hwei-bmn',
      name: 'Kickoff Meeting',
      creator: 'Admin',
      notes: 'This is the starting point for our Google Meet sharing platform.',
      timestamp: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    };
    setLinks([demoLink]);
  }, []);

  const validateGoogleMeetUrl = (url: string): boolean => {
    const meetUrlPattern = /^https:\/\/meet\.google\.com\/[a-z-]+$/;
    return meetUrlPattern.test(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply character limits
    let finalValue = value;
    if (name === 'name' && value.length > 50) {
      finalValue = value.slice(0, 50);
    } else if (name === 'notes' && value.length > 500) {
      finalValue = value.slice(0, 500);
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!validateGoogleMeetUrl(formData.url)) {
      newErrors.url = 'Please enter a valid Google Meet URL';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Meeting name is required';
    }

    if (!formData.creator.trim()) {
      newErrors.creator = 'Creator name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newLink: MeetLink = {
      id: Date.now().toString(),
      url: formData.url,
      name: formData.name,
      creator: formData.creator,
      notes: formData.notes,
      timestamp: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    };

    setLinks(prev => [newLink, ...prev]);
    setFormData({ url: '', name: '', creator: '', notes: '' });
  };

  const toggleNotes = (id: string) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-background font-['Roboto',sans-serif]">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-foreground mb-2">Meet Link Nexus</h1>
            <p className="text-muted-foreground text-lg">Professional Google Meet link sharing platform</p>
          </div>

          {/* Submission Form */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Google Meet URL *
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    errors.url ? 'border-red-500' : 'border-input'
                  }`}
                />
                {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meeting Name * (50 chars max)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter meeting name"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    errors.name ? 'border-red-500' : 'border-input'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  <p className="text-xs text-muted-foreground ml-auto">{formData.name.length}/50</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Creator Name *
                </label>
                <input
                  type="text"
                  name="creator"
                  value={formData.creator}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    errors.creator ? 'border-red-500' : 'border-input'
                  }`}
                />
                {errors.creator && <p className="text-red-500 text-sm mt-1">{errors.creator}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes (500 chars max)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Optional meeting notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.notes.length}/500</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-all duration-300 ease-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Meet Link</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-foreground mb-2">Recent Meet Links</h2>
          <p className="text-muted-foreground">Click on any meeting name to join</p>
        </div>

        {/* Links Display */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {links.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No meeting links yet. Add your first one above!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {links.map((link, index) => (
                  <div
                    key={link.id}
                    className="p-6 hover:bg-gray-50 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col space-y-3">
                      {/* Meeting Name and Link */}
                      <div className="flex items-start justify-between">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center space-x-2 group"
                        >
                          <span>{link.name}</span>
                          <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Clock size={14} />
                          <span>{link.timestamp}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User size={14} />
                          <span className="italic">{link.creator}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      {link.notes && (
                        <div className="flex items-start space-x-2">
                          <FileText size={14} className="mt-1 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                              {expandedNotes[link.id] 
                                ? link.notes 
                                : truncateText(link.notes, 100)
                              }
                              {link.notes.length > 100 && (
                                <button
                                  onClick={() => toggleNotes(link.id)}
                                  className="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 text-xs underline"
                                >
                                  {expandedNotes[link.id] ? 'Show less' : 'Show more'}
                                </button>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Index;
