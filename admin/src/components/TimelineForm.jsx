import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function TimelineForm({ item, onSave, onCancel }) {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState(item || {
    id: '',
    title: '',
    description: '',
    type: 'work',
    startDate: '',
    endDate: '',
    location: '',
    organization: '',
    position: '',
    skills: [],
    achievements: [],
    links: [],
    icon: '',
    color: '#000000',
    featured: false
  });

  const [skillInput, setSkillInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), achievementInput.trim()]
      }));
      setAchievementInput('');
    }
  };

  const handleRemoveAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: (prev.achievements || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddLink = () => {
    if (linkName.trim() && linkUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...(prev.links || []), { name: linkName.trim(), url: linkUrl.trim() }]
      }));
      setLinkName('');
      setLinkUrl('');
    }
  };

  const handleRemoveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: (prev.links || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.id || !formData.title || !formData.description) {
      alert(lang === 'zh' ? '请填写必填字段' : 'Please fill in required fields');
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          disabled={!!item}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '类型' : 'Type'}
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="education">{lang === 'zh' ? '教育' : 'Education'}</option>
          <option value="work">{lang === 'zh' ? '工作' : 'Work'}</option>
          <option value="project">{lang === 'zh' ? '项目' : 'Project'}</option>
          <option value="achievement">{lang === 'zh' ? '成就' : 'Achievement'}</option>
        </select>
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

      {/* Organization & Position */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '组织/机构' : 'Organization'}
          </label>
          <input
            type="text"
            name="organization"
            value={formData.organization || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '职位' : 'Position'}
          </label>
          <input
            type="text"
            name="position"
            value={formData.position || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '地点' : 'Location'}
        </label>
        <input
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '技能' : 'Skills'}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="button" onClick={handleAddSkill} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {lang === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.skills || []).map((skill, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded flex items-center gap-1">
              {skill}
              <button type="button" onClick={() => handleRemoveSkill(idx)} className="text-red-500">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '成就' : 'Achievements'}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={achievementInput}
            onChange={(e) => setAchievementInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="button" onClick={handleAddAchievement} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {lang === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
        <div className="space-y-1">
          {(formData.achievements || []).map((ach, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <span className="flex-1 px-2 py-1 bg-gray-50 rounded">{ach}</span>
              <button type="button" onClick={() => handleRemoveAchievement(idx)} className="text-red-500">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '链接' : 'Links'}
        </label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            type="text"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            placeholder={lang === 'zh' ? '链接名称' : 'Link name'}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="URL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={handleAddLink} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {lang === 'zh' ? '添加' : 'Add'}
            </button>
          </div>
        </div>
        <div className="space-y-1">
          {(formData.links || []).map((link, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-gray-50 rounded">{link.name}: {link.url}</span>
              <button type="button" onClick={() => handleRemoveLink(idx)} className="text-red-500">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Featured checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          id="featured"
          checked={formData.featured || false}
          onChange={handleChange}
          className="w-4 h-4"
        />
        <label htmlFor="featured" className="text-sm">
          {lang === 'zh' ? '特色事件' : 'Featured Event'}
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {lang === 'zh' ? '保存' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          {lang === 'zh' ? '取消' : 'Cancel'}
        </button>
      </div>
    </form>
  );
}
