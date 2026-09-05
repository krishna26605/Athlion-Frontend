'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/api/client';
import { 
    Plus, Search, Edit3, Trash2, Eye, FileText, CheckCircle2, 
    XCircle, Tag, Globe, Sparkles, AlertCircle, X, RefreshCw 
} from 'lucide-react';
import Link from 'next/link';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    coverImage?: string;
    author?: string;
    readTime?: string;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
    isPublished: boolean;
    createdAt: string;
}

const CATEGORIES = [
    'Functional Fitness',
    'Obstacle Racing',
    'Athletic Training',
    'Nutrition & Recovery',
    'Race Guides'
];

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form fields
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        category: 'Functional Fitness',
        coverImage: '',
        author: 'Athlion Team',
        readTime: '5 min read',
        tags: '',
        metaTitle: '',
        metaDescription: '',
        isPublished: true,
    });

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('blogs?all=true');
            if (res.data && res.data.data) {
                setBlogs(res.data.data);
            }
        } catch (err: any) {
            console.error('Error loading blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleOpenModal = (blog?: Blog) => {
        setErrorMsg('');
        setSuccessMsg('');
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title || '',
                slug: blog.slug || '',
                content: blog.content || '',
                excerpt: blog.excerpt || '',
                category: blog.category || 'Functional Fitness',
                coverImage: blog.coverImage || '',
                author: blog.author || 'Athlion Team',
                readTime: blog.readTime || '5 min read',
                tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
                metaTitle: blog.metaTitle || '',
                metaDescription: blog.metaDescription || '',
                isPublished: blog.isPublished ?? true,
            });
        } else {
            setEditingBlog(null);
            setFormData({
                title: '',
                slug: '',
                content: '',
                excerpt: '',
                category: 'Functional Fitness',
                coverImage: '',
                author: 'Athlion Team',
                readTime: '5 min read',
                tags: 'Functional Fitness, Training, Athletic Performance',
                metaTitle: '',
                metaDescription: '',
                isPublished: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBlog(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Auto generate slug if title changes and user hasn't edited slug manually
            ...(name === 'title' && !editingBlog ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') } : {})
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const payload = {
                ...formData,
                tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags,
            };

            if (editingBlog) {
                await apiClient.put(`blogs/${editingBlog._id}`, payload);
                setSuccessMsg('Blog post updated successfully!');
            } else {
                await apiClient.post('blogs', payload);
                setSuccessMsg('New blog post published successfully!');
            }

            await fetchBlogs();
            setTimeout(() => {
                handleCloseModal();
            }, 1000);
        } catch (err: any) {
            console.error('Error saving blog:', err);
            setErrorMsg(err.response?.data?.message || err.message || 'Failed to save blog post. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await apiClient.delete(`blogs/${id}`);
            fetchBlogs();
        } catch (err) {
            console.error('Error deleting blog:', err);
            alert('Failed to delete blog post.');
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8">
            {/* Header & Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/60 border border-white/10 p-5 rounded-2xl">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">Total Articles</span>
                    <span className="text-3xl font-black italic text-white">{blogs.length}</span>
                </div>
                <div className="bg-zinc-900/60 border border-white/10 p-5 rounded-2xl">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">Published</span>
                    <span className="text-3xl font-black italic text-emerald-400">{blogs.filter(b => b.isPublished).length}</span>
                </div>
                <div className="bg-zinc-900/60 border border-white/10 p-5 rounded-2xl">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">Categories</span>
                    <span className="text-3xl font-black italic text-[#f82506]">{CATEGORIES.length}</span>
                </div>
                <div className="bg-zinc-900/60 border border-white/10 p-5 rounded-2xl">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">SEO Readiness</span>
                    <span className="text-3xl font-black italic text-blue-400">100%</span>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/40 p-4 rounded-2xl border border-white/10">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-80">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search articles by title or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#f82506] outline-none"
                        />
                    </div>
                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#f82506] outline-none"
                    >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button
                        onClick={fetchBlogs}
                        className="p-2.5 bg-zinc-900 text-gray-400 hover:text-white rounded-xl border border-white/10 hover:border-white/20"
                        title="Refresh"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#f82506] hover:bg-[#d01e03] text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg shadow-[#f82506]/20 transition-all"
                    >
                        <Plus size={18} /> Add New Article
                    </button>
                </div>
            </div>

            {/* Blog List Table */}
            <div className="bg-zinc-900/40 rounded-2xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400 font-medium">Loading articles...</div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText size={48} className="mx-auto text-gray-600 mb-3" />
                        <p className="text-gray-400 text-base font-bold uppercase">No articles found</p>
                        <p className="text-gray-600 text-xs mt-1">Click &quot;Add New Article&quot; to publish your first SEO blog post.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white/5">
                                    <th className="p-4">Article</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Author & Time</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredBlogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-start gap-3">
                                                {blog.coverImage ? (
                                                    <img src={blog.coverImage} alt={blog.title} className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-gray-500 shrink-0">
                                                        <FileText size={20} />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-white leading-tight line-clamp-1">{blog.title}</h3>
                                                    <span className="text-[11px] font-mono text-gray-500 block mt-0.5">/functional-fitness/blog/{blog.slug}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-300">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-gray-400">
                                            <div>{blog.author || 'Athlion Team'}</div>
                                            <div className="text-gray-500">{blog.readTime || '5 min read'}</div>
                                        </td>
                                        <td className="p-4">
                                            {blog.isPublished ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold">
                                                    <CheckCircle2 size={12} /> Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold">
                                                    <XCircle size={12} /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/functional-fitness/blog/${blog.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Preview Article"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleOpenModal(blog)}
                                                    className="p-2 text-gray-400 hover:text-[#f82506] hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog._id, blog.title)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CREATE / EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-4xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <span className="text-[#f82506] font-black uppercase text-xs tracking-widest block mb-1">
                                {editingBlog ? 'EDIT ARTICLE' : 'NEW SEO ARTICLE'}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white">
                                {editingBlog ? 'Update Blog Content' : 'Create Functional Fitness Blog'}
                            </h2>
                        </div>

                        {errorMsg && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm flex items-center gap-2">
                                <AlertCircle size={18} /> {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm flex items-center gap-2">
                                <CheckCircle2 size={18} /> {successMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Grid 1: Title & Slug */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                        Article Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Master Compromised Running for Functional Fitness"
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#f82506] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                        URL Slug *
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        required
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        placeholder="master-compromised-running-functional-fitness"
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#f82506] outline-none font-mono"
                                    />
                                </div>
                            </div>

                            {/* Grid 2: Category, Author, Read Time */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#f82506] outline-none"
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        placeholder="Athlion Head Coach"
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#f82506] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                        Read Time
                                    </label>
                                    <input
                                        type="text"
                                        name="readTime"
                                        value={formData.readTime}
                                        onChange={handleInputChange}
                                        placeholder="5 min read"
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#f82506] outline-none"
                                    />
                                </div>
                            </div>

                            {/* Cover Image URL */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Cover Image URL
                                </label>
                                <input
                                    type="text"
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleInputChange}
                                    placeholder="https://images.unsplash.com/... or /images/blog-cover.jpg"
                                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#f82506] outline-none"
                                />
                            </div>

                            {/* Short Excerpt */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Short Excerpt (SEO Summary Card) *
                                </label>
                                <textarea
                                    name="excerpt"
                                    required
                                    rows={2}
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                    placeholder="Brief 2-sentence summary highlighting functional strength, station splits, and running performance."
                                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#f82506] outline-none"
                                />
                            </div>

                            {/* Content Body */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Full Article Content (Markdown or HTML format) *
                                </label>
                                <textarea
                                    name="content"
                                    required
                                    rows={10}
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    placeholder="Write full article here. Supports ## Headings, **bold**, lists, and standard formatting."
                                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#f82506] outline-none font-mono"
                                />
                            </div>

                            {/* SEO Meta Fields Section */}
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                <span className="text-[#f82506] text-xs font-black uppercase tracking-widest block">
                                    SEO & META DATA OPTIMIZATION
                                </span>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                                        Custom Meta Title Tag
                                    </label>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleInputChange}
                                        placeholder="Defaults to article title if left empty"
                                        className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#f82506] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                                        Custom Meta Description Tag
                                    </label>
                                    <input
                                        type="text"
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleInputChange}
                                        placeholder="Defaults to excerpt if left empty"
                                        className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#f82506] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                                        Keywords / Tags (Comma Separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        placeholder="Functional Fitness, Sled Push, Running Splits, Mudgar Training"
                                        className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#f82506] outline-none"
                                    />
                                </div>
                            </div>

                            {/* Published Status Switch */}
                            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-white/10">
                                <div>
                                    <span className="font-bold text-sm text-white block">Publish Status</span>
                                    <span className="text-xs text-gray-400">Published articles appear publicly on Functional Fitness Hub immediately.</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                                        formData.isPublished 
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                            : 'bg-zinc-800 text-gray-400 border border-white/10'
                                    }`}
                                >
                                    {formData.isPublished ? 'Published' : 'Draft'}
                                </button>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 bg-zinc-900 text-gray-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-3 bg-[#f82506] hover:bg-[#d01e03] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#f82506]/20 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Saving Article...' : editingBlog ? 'Update Article' : 'Publish Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
