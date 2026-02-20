import React, { useState } from 'react';
import { 
  Share2, 
  Facebook, 
  Instagram, 
  Plus, 
  Sparkles, 
  Calendar, 
  Send, 
  Image as ImageIcon,
  MoreVertical,
  ChevronRight,
  Clock,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialPost } from '../types';

export const SocialMediaManager: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([
    { 
      id: 'p1', 
      platform: 'instagram', 
      content: 'Check out our new Kia Sportage! Perfect for your next weekend getaway. #Rental #Travel', 
      image_prompt: 'A sleek 2017 Kia Sportage driving on a scenic coastal road at sunset.',
      status: 'scheduled',
      scheduled_at: '2026-02-22T10:00:00Z'
    },
    { 
      id: 'p2', 
      platform: 'facebook', 
      content: 'Need a reliable car for rideshare? Our Toyota Camry is available now at competitive rates!', 
      image_prompt: 'A clean white Toyota Camry parked in a modern urban setting.',
      status: 'draft'
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePost = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPost: SocialPost = {
        id: `p${Date.now()}`,
        platform: 'instagram',
        content: 'Experience luxury on a budget. Rent our premium fleet today! ✨',
        image_prompt: 'Luxury car interior close-up, high-end leather seats, cinematic lighting.',
        status: 'draft'
      };
      setPosts([newPost, ...posts]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Social Media Command</h2>
          <p className="text-slate-500 mt-1">Generate and schedule content for Facebook and Instagram.</p>
        </div>
        <button 
          onClick={generatePost}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {isGenerating ? 'AI Generating...' : 'AI Generate Post'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Content Pipeline</h3>
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      post.platform === 'facebook' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                    }`}>
                      {post.platform === 'facebook' ? <Facebook className="w-5 h-5" /> : <Instagram className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{post.platform}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          post.status === 'scheduled' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {post.status}
                        </span>
                        {post.scheduled_at && (
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(post.scheduled_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-4">{post.content}</p>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Image Prompt</span>
                  </div>
                  <p className="text-xs text-slate-500 italic">{post.image_prompt}</p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                    Edit Draft
                  </button>
                  <button className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2">
                    <Send className="w-3.5 h-3.5" /> {post.status === 'scheduled' ? 'Update Schedule' : 'Post Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> AI Strategy
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                  "Engagement is highest on <b>Instagram</b> between 6 PM and 9 PM. Consider posting a vehicle highlight today."
                </p>
              </div>
              <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Analyze Performance <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Auto-Post</h3>
              <p className="text-indigo-100 text-sm mb-6">Let AI handle your entire social calendar based on fleet availability.</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-white/20 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Enable AI Pilot</span>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Share2 className="w-32 h-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
