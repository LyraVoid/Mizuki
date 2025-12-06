import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ProjectForm({ project, onSave, onCancel }) {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState(project || {
    id: '',
    title: '',
    description: '',
    image: '',
    category: 'web',
    techStack: [],
    status: 'planned',
    liveDemo: '',
    sourceCode: '',
    visitUrl: '',
    startDate: '',
    endDate: '',
    featured: false,
    tags: []
  });

  const [techStackInput, setTechStackInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTech = () => {
    if (techStackInput.trim()) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techStackInput.trim()]
      }));
      setTechStackInput('');
    }
  };

  const handleRemoveTech = (index) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (tagsInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagsInput.trim()]
      }));
      setTagsInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.id || !formData.title || !formData.description) {
      alert(lang === 'zh' ? '请填写必填字段' : 'Please fill in required fields');
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ID (only for new projects) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          disabled={!!project}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="project-unique-id"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '标题' : 'Title'} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '描述' : 'Description'} <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '类别' : 'Category'}
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="web">Web</option>
            <option value="mobile">{lang === 'zh' ? '移动应用' : 'Mobile'}</option>
            <option value="desktop">{lang === 'zh' ? '桌面应用' : 'Desktop'}</option>
            <option value="other">{lang === 'zh' ? '其他' : 'Other'}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '状态' : 'Status'}
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="completed">{lang === 'zh' ? '已完成' : 'Completed'}</option>
            <option value="in-progress">{lang === 'zh' ? '进行中' : 'In Progress'}</option>
            <option value="planned">{lang === 'zh' ? '计划中' : 'Planned'}</option>
          </select>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '技术栈' : 'Tech Stack'}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
            placeholder={lang === 'zh' ? '输入技术名称' : 'Enter tech name'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddTech}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {lang === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.techStack.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded flex items-center gap-1">
              {tech}
              <button
                type="button"
                onClick={() => handleRemoveTech(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '开始日期' : 'Start Date'}
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '结束日期' : 'End Date'}
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '演示链接' : 'Live Demo'}
          </label>
          <input
            type="url"
            name="liveDemo"
            value={formData.liveDemo || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '源码链接' : 'Source Code'}
          </label>
          <input
            type="url"
            name="sourceCode"
            value={formData.sourceCode || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '标签' : 'Tags'}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder={lang === 'zh' ? '输入标签' : 'Enter tag'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {lang === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.tags || []).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          id="featured"
          checked={formData.featured || false}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="featured" className="text-sm text-gray-700">
          {lang === 'zh' ? '特色项目' : 'Featured Project'}
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {lang === 'zh' ? '保存' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {lang === 'zh' ? '取消' : 'Cancel'}
        </button>
      </div>
    </form>
  );
}
